import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { SnippetLinkProvider } from '../../snippetLinkProvider';
import { SnippetDetector } from '../../snippetDetector';
import { PathResolver } from '../../pathResolver';
import { SnippetLocator } from '../../snippetLocator';

suite('SnippetLinkProvider', () => {
	test('should provide document link for snippet reference', () => {
		const detector = new SnippetDetector();
		const resolver = new PathResolver(() => true);
		const locator = new SnippetLocator();
		const provider = new SnippetLinkProvider(detector, resolver, locator);

		const document = {
			getText: () => '--8<-- "path/to/file.txt"',
			uri: vscode.Uri.file('/workspace/docs/guide.md'),
			positionAt: (offset: number) => new vscode.Position(0, offset),
		} as vscode.TextDocument;

		const links = provider.provideDocumentLinks(document);

		assert.strictEqual(links?.length, 1);
		assert.ok(links![0].target);
		// Normalize paths for cross-platform compatibility
		const expectedPath = path.normalize('/workspace/docs/path/to/file.txt');
		const actualPath = path.normalize(links![0].target!.fsPath);
		assert.strictEqual(actualPath, expectedPath);
	});
});
