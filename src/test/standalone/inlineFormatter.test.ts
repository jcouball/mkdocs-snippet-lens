import { describe, it } from 'mocha';
import * as assert from 'assert';
import { formatForInlineDisplay } from '../../inlineFormatter';

describe('InlineFormatter', () => {
	describe('formatForInlineDisplay', () => {
		it('should replace newlines with arrow symbols', () => {
			const content = 'line 1\nline 2\nline 3';
			const result = formatForInlineDisplay(content);

			assert.strictEqual(result, 'line 1 ⏎ line 2 ⏎ line 3');
		});

		it('should handle single line content', () => {
			const content = 'single line';
			const result = formatForInlineDisplay(content);

			assert.strictEqual(result, 'single line');
		});

		it('should handle empty content', () => {
			const content = '';
			const result = formatForInlineDisplay(content);

			assert.strictEqual(result, '');
		});

		it('should handle content with multiple consecutive newlines', () => {
			const content = 'line 1\n\n\nline 2';
			const result = formatForInlineDisplay(content);

			assert.strictEqual(result, 'line 1 ⏎  ⏎  ⏎ line 2');
		});

		it('should handle content with trailing newline', () => {
			const content = 'line 1\nline 2\n';
			const result = formatForInlineDisplay(content);

			assert.strictEqual(result, 'line 1 ⏎ line 2 ⏎ ');
		});

		it('should truncate content when maxLines is specified', () => {
			const content = 'line 1\nline 2\nline 3\nline 4\nline 5';
			const result = formatForInlineDisplay(content, 3);

			assert.strictEqual(result, 'line 1 ⏎ line 2 ⏎ line 3 ⏎ ... (2 more lines)');
		});

		it('should not truncate when content is under maxLines', () => {
			const content = 'line 1\nline 2';
			const result = formatForInlineDisplay(content, 5);

			assert.strictEqual(result, 'line 1 ⏎ line 2');
		});

		it('should handle maxLines equal to content lines', () => {
			const content = 'line 1\nline 2\nline 3';
			const result = formatForInlineDisplay(content, 3);

			assert.strictEqual(result, 'line 1 ⏎ line 2 ⏎ line 3');
		});

		it('should use singular "line" when only 1 line is hidden', () => {
			const content = 'line 1\nline 2\nline 3';
			const result = formatForInlineDisplay(content, 2);

			assert.strictEqual(result, 'line 1 ⏎ line 2 ⏎ ... (1 more line)');
		});

		it('should truncate by character limit when specified', () => {
			const content = 'This is a very long line that should be truncated';
			const result = formatForInlineDisplay(content, undefined, 20);

			assert.strictEqual(result, 'This is a very long ...');
		});

		it('should apply both line and character limits', () => {
			const content = 'line 1 is very long\nline 2 is also very long\nline 3';
			const result = formatForInlineDisplay(content, 2, 30);

			// First truncate to 2 lines, then to 30 chars
			assert.strictEqual(result, 'line 1 is very long ⏎ line 2 i...');
		});

		it('should not truncate when content is under character limit', () => {
			const content = 'short';
			const result = formatForInlineDisplay(content, undefined, 100);

			assert.strictEqual(result, 'short');
		});

		it('should handle character limit of 0 or negative', () => {
			const content = 'test content';
			const resultZero = formatForInlineDisplay(content, undefined, 0);
			const resultNegative = formatForInlineDisplay(content, undefined, -5);

			// Should not truncate when maxChars is 0 or negative
			assert.strictEqual(resultZero, 'test content');
			assert.strictEqual(resultNegative, 'test content');
		});
	});
});
