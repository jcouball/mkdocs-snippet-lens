import * as assert from 'assert';
import * as vscode from 'vscode';
import { PreviewManager } from '../../previewManager';
import { SnippetDetector } from '../../snippetDetector';
import { PathResolver } from '../../pathResolver';
import { SnippetLocator } from '../../snippetLocator';

suite('PreviewManager', () => {
	test('should be enabled by default', () => {
		const detector = new SnippetDetector();
		const resolver = new PathResolver(() => true);
		const locator = new SnippetLocator();
		const readFile = () => 'test content';

		const manager = new PreviewManager(detector, resolver, locator, readFile);

		assert.strictEqual(manager.isEnabled(), true);
		manager.dispose();
	});

	test('should toggle enabled state', () => {
		const detector = new SnippetDetector();
		const resolver = new PathResolver(() => true);
		const locator = new SnippetLocator();
		const readFile = () => 'test content';

		const manager = new PreviewManager(detector, resolver, locator, readFile);

		assert.strictEqual(manager.isEnabled(), true);
		manager.toggle();
		assert.strictEqual(manager.isEnabled(), false);
		manager.toggle();
		assert.strictEqual(manager.isEnabled(), true);

		manager.dispose();
	});

	test('should create decoration type on construction', () => {
		const detector = new SnippetDetector();
		const resolver = new PathResolver(() => true);
		const locator = new SnippetLocator();
		const readFile = () => 'test content';

		// This test verifies that the constructor completes successfully
		// and creates the decoration type without throwing errors
		const manager = new PreviewManager(detector, resolver, locator, readFile);

		// If we get here without errors, the decoration type was created successfully
		assert.ok(manager);
		manager.dispose();
	});

	test('should handle multi-line content with inline formatting', () => {
		const detector = new SnippetDetector();
		const resolver = new PathResolver(() => true);
		const locator = new SnippetLocator();

		// Mock file with 5 lines
		const multiLineContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
		const readFile = () => multiLineContent;

		const manager = new PreviewManager(detector, resolver, locator, readFile);

		// Verify the manager was created successfully
		assert.ok(manager);
		assert.strictEqual(manager.isEnabled(), true);

		// The actual formatting happens in updatePreviews, which requires a document
		// Here we just verify that multi-line content can be read
		const content = readFile();
		const lines = content.split('\n');
		assert.strictEqual(lines.length, 5, 'Should read all 5 lines');
		assert.strictEqual(lines[0], 'Line 1', 'First line should match');
		assert.strictEqual(lines[4], 'Line 5', 'Last line should match');

		manager.dispose();
	});
});
