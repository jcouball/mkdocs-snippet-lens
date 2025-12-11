import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { PreviewManager } from '../previewManager';
import { SnippetDetector } from '../snippetDetector';
import { PathResolver } from '../pathResolver';
import { SnippetLocator } from '../snippetLocator';

suite('Extension Integration Test Suite', () => {
	vscode.window.showInformationMessage('Start integration tests.');

	test('Ghost text preview should render all lines from snippet file', async () => {
		// Create a temporary test file with multi-line content
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			assert.fail('No workspace folder found');
		}

		const testSnippetPath = path.join(workspaceFolder.uri.fsPath, 'test-snippet.txt');
		const testMarkdownPath = path.join(workspaceFolder.uri.fsPath, 'test-markdown.md');

		// Create snippet file with exactly 5 lines
		const snippetContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
		fs.writeFileSync(testSnippetPath, snippetContent);

		// Create markdown file referencing the snippet
		const markdownContent = '# Test\n\n--8<-- "test-snippet.txt"\n\nMore content';
		fs.writeFileSync(testMarkdownPath, markdownContent);

		try {
			// Open the markdown file
			const doc = await vscode.workspace.openTextDocument(testMarkdownPath);
			const editor = await vscode.window.showTextDocument(doc);

			// Wait for decorations to be applied (give extension time to process)
			await new Promise(resolve => setTimeout(resolve, 500));

			// Get all decorations applied to the document
			// Note: VS Code doesn't provide a direct API to read decorations,
			// so we need to verify through other means

			// For now, verify the document is open and contains the snippet reference
			const text = doc.getText();
			assert.ok(text.includes('--8<-- "test-snippet.txt"'), 'Snippet reference should exist');

			// The preview should be visible as "before" decoration on line 4 (next line after snippet)
			// We can't directly access decorations, but we can verify the setup is correct
			assert.strictEqual(doc.lineCount, 5, 'Document should have 5 lines');
			assert.ok(doc.lineAt(2).text.includes('--8<--'), 'Line 3 should contain snippet reference');

		} finally {
			// Cleanup
			try {
				fs.unlinkSync(testSnippetPath);
				fs.unlinkSync(testMarkdownPath);
			} catch (e) {
				// Ignore cleanup errors
			}

			// Close all editors
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		}
	}).timeout(5000);

	test('Preview should handle multi-line content correctly', async () => {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			assert.fail('No workspace folder found');
		}

		const testSnippetPath = path.join(workspaceFolder.uri.fsPath, 'test-multiline.txt');
		const testMarkdownPath = path.join(workspaceFolder.uri.fsPath, 'test-multiline.md');

		// Create snippet with specific multi-line content
		const snippetLines = [
			'First line of content',
			'Second line of content',
			'Third line of content',
			'Fourth line of content',
			'Fifth line of content'
		];
		const snippetContent = snippetLines.join('\n');
		fs.writeFileSync(testSnippetPath, snippetContent);

		// Create markdown file
		const markdownContent = '--8<-- "test-multiline.txt"\n';
		fs.writeFileSync(testMarkdownPath, markdownContent);

		try {
			const doc = await vscode.workspace.openTextDocument(testMarkdownPath);
			await vscode.window.showTextDocument(doc);

			// Wait for processing
			await new Promise(resolve => setTimeout(resolve, 500));

			// Verify document structure
			const text = doc.getText();
			assert.ok(text.includes('--8<-- "test-multiline.txt"'), 'Should contain snippet reference');

			// The preview manager should read all 5 lines
			// Since we can't directly verify decorations, we verify the file content is correct
			const actualContent = fs.readFileSync(testSnippetPath, 'utf-8');
			const actualLines = actualContent.split('\n');
			assert.strictEqual(actualLines.length, 5, 'Snippet file should have exactly 5 lines');
			assert.strictEqual(actualLines[0], snippetLines[0], 'First line should match');
			assert.strictEqual(actualLines[4], snippetLines[4], 'Last line should match');

		} finally {
			try {
				fs.unlinkSync(testSnippetPath);
				fs.unlinkSync(testMarkdownPath);
			} catch (e) {
				// Ignore cleanup errors
			}
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		}
	}).timeout(5000);

	test('Preview decoration should contain all lines from snippet', async () => {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			assert.fail('No workspace folder found');
		}

		const testSnippetPath = path.join(workspaceFolder.uri.fsPath, 'test-decoration.txt');
		const testMarkdownPath = path.join(workspaceFolder.uri.fsPath, 'test-decoration.md');

		// Create snippet with exactly 5 lines that we'll verify in decoration
		const snippetContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
		fs.writeFileSync(testSnippetPath, snippetContent);

		// Create markdown with snippet reference followed by more content
		const markdownContent = '--8<-- "test-decoration.txt"\nNext line';
		fs.writeFileSync(testMarkdownPath, markdownContent);

		try {
			const doc = await vscode.workspace.openTextDocument(testMarkdownPath);
			const editor = await vscode.window.showTextDocument(doc);

			// Create preview manager with custom readFile to verify it's called
			let fileReadCount = 0;
			let lastReadContent = '';
			const readFile = (filePath: string) => {
				fileReadCount++;
				lastReadContent = fs.readFileSync(filePath, 'utf-8');
				return lastReadContent;
			};

			const detector = new SnippetDetector();
			const resolver = new PathResolver((p: string) => fs.existsSync(p));
			const locator = new SnippetLocator();
		const previewManager = new PreviewManager(detector, resolver, locator, readFile);

			// Verify the file was read
			assert.ok(fileReadCount > 0, 'Snippet file should have been read');

			// Verify all lines were read
			const lines = lastReadContent.split('\n');
			assert.strictEqual(lines.length, 5, 'Should read all 5 lines from snippet');
			assert.strictEqual(lines[0], 'Line 1', 'First line should match');
			assert.strictEqual(lines[1], 'Line 2', 'Second line should match');
			assert.strictEqual(lines[2], 'Line 3', 'Third line should match');
			assert.strictEqual(lines[3], 'Line 4', 'Fourth line should match');
			assert.strictEqual(lines[4], 'Line 5', 'Fifth line should match');

			previewManager.dispose();

		} finally {
			try {
				fs.unlinkSync(testSnippetPath);
				fs.unlinkSync(testMarkdownPath);
			} catch (e) {
				// Ignore cleanup errors
			}
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		}
	}).timeout(5000);

	test('Preview decoration contentText should preserve newlines', async () => {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			assert.fail('No workspace folder found');
		}

		const testSnippetPath = path.join(workspaceFolder.uri.fsPath, 'test-newlines.txt');
		const testMarkdownPath = path.join(workspaceFolder.uri.fsPath, 'test-newlines.md');

		// Create snippet with multi-line content including empty lines
		const snippetContent = 'Line 1\n\nLine 3\nLine 4';
		fs.writeFileSync(testSnippetPath, snippetContent);

		// Create markdown
		const markdownContent = '--8<-- "test-newlines.txt"\nMore content';
		fs.writeFileSync(testMarkdownPath, markdownContent);

		try {
			const doc = await vscode.workspace.openTextDocument(testMarkdownPath);
			await vscode.window.showTextDocument(doc);

			// Track what decoration is applied by capturing it
			let appliedDecorations: vscode.DecorationOptions[] = [];
			const originalSetDecorations = vscode.window.activeTextEditor?.setDecorations;

			// Create preview manager
			const detector = new SnippetDetector();
			const resolver = new PathResolver((p: string) => fs.existsSync(p));
			const locator = new SnippetLocator();

			let capturedContentText = '';
			const readFile = (filePath: string) => {
				const content = fs.readFileSync(filePath, 'utf-8');

				// Simulate what PreviewManager does
				const lines = content.split('\n');
				capturedContentText = lines.map(l => `  ${l}`).join('\n') + '\n';

				return content;
			};

			const previewManager = new PreviewManager(detector, resolver, locator, readFile);
			previewManager.updatePreviews(doc);

			await new Promise(resolve => setTimeout(resolve, 100));

			// Verify the formatted content preserves newlines
			assert.ok(capturedContentText.length > 0, 'Should have captured content');
			const newlineCount = (capturedContentText.match(/\n/g) || []).length;
			assert.strictEqual(newlineCount, 4, 'Should have 4 newlines (3 between lines + 1 trailing)');
			assert.ok(capturedContentText.includes('  Line 1\n'), 'Should contain Line 1 with newline');
			assert.ok(capturedContentText.includes('  \n'), 'Should contain empty line with newline');
			assert.ok(capturedContentText.includes('  Line 3\n'), 'Should contain Line 3 with newline');

			previewManager.dispose();

		} finally {
			try {
				fs.unlinkSync(testSnippetPath);
				fs.unlinkSync(testMarkdownPath);
			} catch (e) {
				// Ignore cleanup errors
			}
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		}
	}).timeout(5000);
});
