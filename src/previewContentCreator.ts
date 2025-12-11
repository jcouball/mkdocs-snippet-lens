import { PathResolver } from './pathResolver';
import { SnippetLocation } from './snippetLocator';
import { formatForInlineDisplay } from './inlineFormatter';

/**
 * Creates preview content for a snippet location
 * @param location The snippet location to create preview for
 * @param documentPath The path of the markdown document
 * @param workspaceRoot The workspace root path
 * @param basePath The configured base path for snippets
 * @param maxLines Maximum number of lines to show in preview
 * @param maxChars Maximum number of characters to show in preview
 * @param resolver The path resolver to use
 * @param readFile Function to read file contents
 * @returns The formatted preview content or undefined if file can't be read
 */
export function createPreviewContent(
	location: SnippetLocation,
	documentPath: string,
	workspaceRoot: string,
	basePath: string,
	maxLines: number,
	maxChars: number,
	resolver: PathResolver,
	readFile: (path: string) => string
): string | undefined {
	const resolvedPath = resolver.resolve(
		location.snippet.path,
		documentPath,
		workspaceRoot,
		basePath
	);

	if (!resolvedPath) {
		return undefined;
	}

	try {
		const content = readFile(resolvedPath);
		return formatForInlineDisplay(content.toString(), maxLines, maxChars);
	} catch (error) {
		return undefined;
	}
}
