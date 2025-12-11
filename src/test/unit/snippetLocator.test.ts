import * as assert from 'assert';
import { SnippetLocator } from '../../snippetLocator';

describe('SnippetLocator', () => {
	describe('locateSnippets', () => {
		it('should locate snippet with double quotes', () => {
			const locator = new SnippetLocator();
			const text = '--8<-- "path/to/file.txt"';
			const snippets = [{ path: 'path/to/file.txt' }];

			const locations = locator.locateSnippets(text, snippets);

			assert.strictEqual(locations.length, 1);
			// Verify the link underlines exactly the path, not the quotes
			assert.strictEqual(text.substring(locations[0].startOffset, locations[0].endOffset), 'path/to/file.txt');
			assert.strictEqual(locations[0].startOffset, 8); // After '--8<-- "'
			assert.strictEqual(locations[0].endOffset, 24); // 8 + 16 (length of path only)
			assert.strictEqual(locations[0].snippet.path, 'path/to/file.txt');
		});

		it('should locate snippet with single quotes', () => {
			const locator = new SnippetLocator();
			const text = "--8<-- 'path/to/file.txt'";
			const snippets = [{ path: 'path/to/file.txt' }];

			const locations = locator.locateSnippets(text, snippets);

			assert.strictEqual(locations.length, 1);
			// Verify the link underlines exactly the path, not the quotes
			assert.strictEqual(text.substring(locations[0].startOffset, locations[0].endOffset), 'path/to/file.txt');
			assert.strictEqual(locations[0].startOffset, 8);
		});

		it('should locate multiple snippets', () => {
			const locator = new SnippetLocator();
			const text = '--8<-- "file1.txt"\nSome text\n--8<-- "file2.txt"';
			const snippets = [
				{ path: 'file1.txt' },
				{ path: 'file2.txt' }
			];

			const locations = locator.locateSnippets(text, snippets);

			assert.strictEqual(locations.length, 2);
			assert.strictEqual(locations[0].snippet.path, 'file1.txt');
			assert.strictEqual(locations[1].snippet.path, 'file2.txt');
		});

		it('should return empty array when snippet not found in text', () => {
			const locator = new SnippetLocator();
			const text = 'No snippets here';
			const snippets = [{ path: 'file.txt' }];

			const locations = locator.locateSnippets(text, snippets);

			assert.strictEqual(locations.length, 0);
		});

		it('should handle empty snippets array', () => {
			const locator = new SnippetLocator();
			const text = '--8<-- "file.txt"';
			const snippets: any[] = [];

			const locations = locator.locateSnippets(text, snippets);

			assert.strictEqual(locations.length, 0);
		});
	});
});
