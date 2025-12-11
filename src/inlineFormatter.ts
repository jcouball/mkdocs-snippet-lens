/**
 * Formats content for inline display by replacing newlines with visual indicators
 * @param content The content to format
 * @param maxLines Maximum number of lines to show (optional)
 * @param maxChars Maximum number of characters to show (optional)
 * @returns Formatted content with newlines replaced by ' ⏎ '
 */
export function formatForInlineDisplay(content: string, maxLines?: number, maxChars?: number): string {
	if (!content) {
		return '';
	}

	let result = content;
	let hiddenLineCount = 0;

	// Truncate by lines if maxLines is specified
	if (maxLines !== undefined && maxLines > 0) {
		const lines = content.split('\n');
		if (lines.length > maxLines) {
			const visibleLines = lines.slice(0, maxLines);
			hiddenLineCount = lines.length - maxLines;
			result = visibleLines.join('\n');
		}
	}

	// Replace newlines with arrow symbols
	result = result.replace(/\n/g, ' ⏎ ');

	// Add line count indicator if lines were hidden
	if (hiddenLineCount > 0) {
		result += ` ⏎ ... (${hiddenLineCount} more ${hiddenLineCount === 1 ? 'line' : 'lines'})`;
	}

	// Truncate by characters if maxChars is specified (this might remove the line count indicator)
	if (maxChars !== undefined && maxChars > 0 && result.length > maxChars) {
		result = result.substring(0, maxChars) + '...';
	}

	return result;
}
