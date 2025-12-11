/**
 * Information about a detected snippet reference
 */
export interface SnippetInfo {
	/** The file path referenced in the snippet */
	path: string;
}

/**
 * Detects MkDocs snippet syntax (--8<--) in markdown text
 */
export class SnippetDetector {
	/**
	 * Detects snippet references in the given text
	 * @param text The text to search for snippets
	 * @returns Array of detected snippets
	 */
	detect(text: string): SnippetInfo[] {
		const pattern = /--8<--\s+["']([^"']+)["']/g;
		const snippets: SnippetInfo[] = [];
		let match;

		while ((match = pattern.exec(text)) !== null) {
			snippets.push({ path: match[1] });
		}

		return snippets;
	}
}
