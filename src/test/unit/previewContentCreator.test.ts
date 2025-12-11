import { describe, it } from 'mocha';
import * as assert from 'assert';
import { createPreviewContent } from '../../previewContentCreator';
import { PathResolver } from '../../pathResolver';
import { SnippetLocation } from '../../snippetLocator';

describe('PreviewContentCreator', () => {
	describe('createPreviewContent', () => {
		it('should create formatted preview content for valid snippet', () => {
			const location: SnippetLocation = {
				snippet: { path: 'test.md' },
				startOffset: 0,
				endOffset: 10,
				lineEndOffset: 10
			};
			const resolver = new PathResolver(() => true);
			const readFile = () => 'Line 1\nLine 2\nLine 3';

			const result = createPreviewContent(
				location,
				'/docs/main.md',
				'/workspace',
				'',
				20,
				200,
				resolver,
				readFile
			);

			assert.strictEqual(result, 'Line 1 ⏎ Line 2 ⏎ Line 3');
		});

		it('should return undefined when path cannot be resolved', () => {
			const location: SnippetLocation = {
				snippet: { path: 'nonexistent.md' },
				startOffset: 0,
				endOffset: 10,
				lineEndOffset: 10
			};
			const resolver = new PathResolver(() => false);
			const readFile = () => 'content';

			const result = createPreviewContent(
				location,
				'/docs/main.md',
				'/workspace',
				'',
				20,
				200,
				resolver,
				readFile
			);

			assert.strictEqual(result, undefined);
		});

		it('should return undefined when file read throws error', () => {
			const location: SnippetLocation = {
				snippet: { path: 'test.md' },
				startOffset: 0,
				endOffset: 10,
				lineEndOffset: 10
			};
			const resolver = new PathResolver(() => true);
			const readFile = () => {
				throw new Error('File not found');
			};

			const result = createPreviewContent(
				location,
				'/docs/main.md',
				'/workspace',
				'',
				20,
				200,
				resolver,
				readFile
			);

			assert.strictEqual(result, undefined);
		});

		it('should apply maxLines truncation', () => {
			const location: SnippetLocation = {
				snippet: { path: 'test.md' },
				startOffset: 0,
				endOffset: 10,
				lineEndOffset: 10
			};
			const resolver = new PathResolver(() => true);
			const readFile = () => 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';

			const result = createPreviewContent(
				location,
				'/docs/main.md',
				'/workspace',
				'',
				3,
				200,
				resolver,
				readFile
			);

			assert.strictEqual(result, 'Line 1 ⏎ Line 2 ⏎ Line 3 ⏎ ... (2 more lines)');
		});

		it('should apply maxChars truncation', () => {
			const location: SnippetLocation = {
				snippet: { path: 'test.md' },
				startOffset: 0,
				endOffset: 10,
				lineEndOffset: 10
			};
			const resolver = new PathResolver(() => true);
			const readFile = () => 'This is a very long line that should be truncated';

			const result = createPreviewContent(
				location,
				'/docs/main.md',
				'/workspace',
				'',
				20,
				20,
				resolver,
				readFile
			);

			assert.strictEqual(result, 'This is a very long ...');
		});

		it('should handle empty file content', () => {
			const location: SnippetLocation = {
				snippet: { path: 'test.md' },
				startOffset: 0,
				endOffset: 10,
				lineEndOffset: 10
			};
			const resolver = new PathResolver(() => true);
			const readFile = () => '';

			const result = createPreviewContent(
				location,
				'/docs/main.md',
				'/workspace',
				'',
				20,
				200,
				resolver,
				readFile
			);

			assert.strictEqual(result, '');
		});

		it('should use basePath when resolving paths', () => {
			const location: SnippetLocation = {
				snippet: { path: 'snippets/test.md' },
				startOffset: 0,
				endOffset: 10,
				lineEndOffset: 10
			};
			let resolvedWithBasePath = false;
			const resolver = new PathResolver(() => true);
			// Override resolve to check basePath is used
			const originalResolve = resolver.resolve.bind(resolver);
			resolver.resolve = (path, docPath, wsRoot, base) => {
				if (base === '/custom/base') {
					resolvedWithBasePath = true;
				}
				return originalResolve(path, docPath, wsRoot, base);
			};
			const readFile = () => 'content';

			createPreviewContent(
				location,
				'/docs/main.md',
				'/workspace',
				'/custom/base',
				20,
				200,
				resolver,
				readFile
			);

			assert.ok(resolvedWithBasePath, 'Should use basePath when resolving');
		});

		it('should handle multi-line content with both truncations', () => {
			const location: SnippetLocation = {
				snippet: { path: 'test.md' },
				startOffset: 0,
				endOffset: 10,
				lineEndOffset: 10
			};
			const resolver = new PathResolver(() => true);
			const readFile = () => 'First line content\nSecond line content\nThird line content\nFourth line';

			const result = createPreviewContent(
				location,
				'/docs/main.md',
				'/workspace',
				'',
				2,
				40,
				resolver,
				readFile
			);

			// First truncated to 2 lines (exactly 40 chars after ⏎ replacement),
			// line indicator added (making it 61 chars), then char limit cuts it back to 40 + '...'
			assert.strictEqual(result, 'First line content ⏎ Second line content...');
		});
	});
});
