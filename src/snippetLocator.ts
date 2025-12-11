import { SnippetInfo } from './snippetDetector';

/**
 * Information about a snippet's location in text
 */
export interface SnippetLocation {
	snippet: SnippetInfo;
	startOffset: number;
	endOffset: number;
	lineEndOffset: number; // Position after the closing quote for decorations
}

/**
 * Finds the positions of snippets in text
 */
export class SnippetLocator {
	/**
	 * Locates all snippets in the given text with their positions
	 * @param text The text to search
	 * @param snippets The snippets detected in the text
	 * @returns Array of snippet locations with start/end offsets
	 */
	locateSnippets(text: string, snippets: SnippetInfo[]): SnippetLocation[] {
		const locations: SnippetLocation[] = [];

		for (const snippet of snippets) {
			// Try double quotes first
			const doubleQuotePattern = `--8<-- "${snippet.path}"`;
			let index = text.indexOf(doubleQuotePattern);

			if (index === -1) {
				// Try single quotes
				const singleQuotePattern = `--8<-- '${snippet.path}'`;
				index = text.indexOf(singleQuotePattern);
			}

			if (index !== -1) {
				// Calculate offset to just the path (skip '--8<-- "' or "--8<-- '")
				const startOffset = index + 8; // Length of '--8<-- "' or "--8<-- '"
				// End offset is at the end of the path, not including the quote (for link underline)
				const endOffset = startOffset + snippet.path.length;
				// Line end is after the closing quote (for decorations)
				const lineEndOffset = endOffset + 1;

				locations.push({
					snippet,
					startOffset,
					endOffset,
					lineEndOffset
				});
			}
		}

		return locations;
	}
}
