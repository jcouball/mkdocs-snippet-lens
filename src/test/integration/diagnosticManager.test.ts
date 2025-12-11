import * as assert from 'assert';
import * as vscode from 'vscode';

/**
 * Integration tests for DiagnosticManager
 *
 * These tests verify that the DiagnosticManager registered by the extension
 * correctly creates diagnostics for missing snippet files.
 */
suite('DiagnosticManager Integration Tests', () => {
	test('should create diagnostics for missing files', async () => {
		const content = '--8<-- "this-file-does-not-exist.txt"';
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'markdown'
		});

		// Open the document in an editor to trigger diagnostics
		await vscode.window.showTextDocument(doc);

		// Wait for diagnostics to be processed with retry logic
		let snippetDiagnostics: vscode.Diagnostic[] = [];
		for (let i = 0; i < 10; i++) {
			await new Promise(resolve => setTimeout(resolve, 100));
			const diagnostics = vscode.languages.getDiagnostics(doc.uri);
			snippetDiagnostics = diagnostics.filter(d => d.source === 'mkdocs-snippet-lens');
			if (snippetDiagnostics.length > 0) {
				break;
			}
		}

		assert.strictEqual(snippetDiagnostics.length, 1);
		assert.strictEqual(snippetDiagnostics[0].message, "Snippet file not found: 'this-file-does-not-exist.txt'");
		assert.strictEqual(snippetDiagnostics[0].severity, vscode.DiagnosticSeverity.Error);
	});

	test('should create multiple diagnostics for multiple missing files', async () => {
		const content = `--8<-- "missing-file-1.txt"
--8<-- "missing-file-2.txt"`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'markdown'
		});

		// Open the document in an editor to trigger diagnostics
		await vscode.window.showTextDocument(doc);

		// Wait for diagnostics to be processed with retry logic
		let snippetDiagnostics: vscode.Diagnostic[] = [];
		for (let i = 0; i < 10; i++) {
			await new Promise(resolve => setTimeout(resolve, 100));
			const diagnostics = vscode.languages.getDiagnostics(doc.uri);
			snippetDiagnostics = diagnostics.filter(d => d.source === 'mkdocs-snippet-lens');
			if (snippetDiagnostics.length === 2) {
				break;
			}
		}

		assert.strictEqual(snippetDiagnostics.length, 2);
		assert.ok(snippetDiagnostics[0].message.includes('missing-file-1.txt'));
		assert.ok(snippetDiagnostics[1].message.includes('missing-file-2.txt'));
	});

	test('should ignore non-markdown documents', async () => {
		const content = '--8<-- "missing.txt"';
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'plaintext'
		});

		// Open the document in an editor to trigger diagnostics
		await vscode.window.showTextDocument(doc);

		// Wait to ensure diagnostics would have been processed if they were going to be
		await new Promise(resolve => setTimeout(resolve, 300));

		const diagnostics = vscode.languages.getDiagnostics(doc.uri);
		const snippetDiagnostics = diagnostics.filter(d => d.source === 'mkdocs-snippet-lens');

		assert.strictEqual(snippetDiagnostics.length, 0);
	});
});
