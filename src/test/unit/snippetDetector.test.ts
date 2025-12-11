import * as assert from 'assert';
import { SnippetDetector } from '../../snippetDetector';

suite('SnippetDetector', () => {
	suite('detect', () => {
		test('should detect snippet with double quotes', () => {
			const detector = new SnippetDetector();
			const text = '--8<-- "path/to/file.txt"';
			const result = detector.detect(text);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].path, 'path/to/file.txt');
		});

		test('should detect snippet with single quotes', () => {
			const detector = new SnippetDetector();
			const text = "--8<-- 'path/to/file.txt'";
			const result = detector.detect(text);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].path, 'path/to/file.txt');
		});

		test('should return empty array when no snippets found', () => {
			const detector = new SnippetDetector();
			const text = 'This is just regular markdown text';
			const result = detector.detect(text);

			assert.strictEqual(result.length, 0);
		});

		test('should detect multiple snippets', () => {
			const detector = new SnippetDetector();
			const text = '--8<-- "file1.txt"\nSome text\n--8<-- "file2.txt"';
			const result = detector.detect(text);

			assert.strictEqual(result.length, 2);
			assert.strictEqual(result[0].path, 'file1.txt');
			assert.strictEqual(result[1].path, 'file2.txt');
		});

		test('should handle whitespace after --8<--', () => {
			const detector = new SnippetDetector();
			const text = '--8<--   "path/to/file.txt"';
			const result = detector.detect(text);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].path, 'path/to/file.txt');
		});
	});
});
