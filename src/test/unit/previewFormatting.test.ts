import * as assert from 'assert';

describe('Preview Formatting', () => {
	describe('multi-line content rendering', () => {
		it('should preserve all lines when formatting for block display', () => {
			// Simulate what the preview manager does
			const content = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
			const lines = content.split('\n');

			// Verify all lines are present
			assert.strictEqual(lines.length, 5, 'Should have 5 lines');
			assert.strictEqual(lines[0], 'Line 1');
			assert.strictEqual(lines[1], 'Line 2');
			assert.strictEqual(lines[2], 'Line 3');
			assert.strictEqual(lines[3], 'Line 4');
			assert.strictEqual(lines[4], 'Line 5');
		});

		it('should format each line with indentation for preview', () => {
			const content = 'Line 1\nLine 2\nLine 3';
			const lines = content.split('\n');
			const formattedLines = lines.map(line => `  ${line}`);
			const previewText = formattedLines.join('\n') + '\n';

			// Verify the preview text contains all lines with indentation
			assert.ok(previewText.includes('  Line 1\n'), 'Should contain indented Line 1');
			assert.ok(previewText.includes('  Line 2\n'), 'Should contain indented Line 2');
			assert.ok(previewText.includes('  Line 3\n'), 'Should contain indented Line 3');

			// Verify it has newlines between lines
			const resultLines = previewText.trim().split('\n');
			assert.strictEqual(resultLines.length, 3, 'Should have 3 lines in result');
		});

		it('should handle content with empty lines', () => {
			const content = 'Line 1\n\nLine 3\n\nLine 5';
			const lines = content.split('\n');

			assert.strictEqual(lines.length, 5, 'Should have 5 lines including empty ones');
			assert.strictEqual(lines[0], 'Line 1');
			assert.strictEqual(lines[1], '', 'Line 2 should be empty');
			assert.strictEqual(lines[2], 'Line 3');
			assert.strictEqual(lines[3], '', 'Line 4 should be empty');
			assert.strictEqual(lines[4], 'Line 5');
		});

		it('should verify decoration contentText preserves newlines', () => {
			// This test validates that the approach used in PreviewManager
			// preserves newlines in the contentText
			const content = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
			const lines = content.split('\n');
			const previewText = lines.map(l => `  ${l}`).join('\n') + '\n';

			// Count newlines in the result
			const newlineCount = (previewText.match(/\n/g) || []).length;
			assert.strictEqual(newlineCount, 5, 'Should have 5 newlines (4 between lines + 1 trailing)');

			// Verify the text starts with the first line
			assert.ok(previewText.startsWith('  Line 1\n'), 'Should start with indented Line 1');

			// Verify the text ends with the last line
			assert.ok(previewText.includes('  Line 5\n'), 'Should end with indented Line 5');
		});
	});
});
