import * as vscode from 'vscode';
import * as fs from 'fs';
import { SnippetDetector } from './snippetDetector';
import { PathResolver } from './pathResolver';
import { SnippetLocator } from './snippetLocator';

/**
 * Provides hover previews for snippet references
 */
export class SnippetHoverProvider implements vscode.HoverProvider {
	constructor(
		private detector: SnippetDetector,
		private resolver: PathResolver,
		private locator: SnippetLocator,
		private readFile: (path: string) => string = fs.readFileSync as any
	) {}

	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Hover> {
		if (document.languageId !== 'markdown') {
			return undefined;
		}

		const text = document.getText();
		const snippets = this.detector.detect(text);
		const locations = this.locator.locateSnippets(text, snippets);

		// Get workspace root and basePath from configuration
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
		const workspaceRoot = workspaceFolder?.uri.fsPath || '';
		const config = vscode.workspace.getConfiguration('mkdocsSnippetLens');
		const basePath = config.get<string>('basePath', '');
		const maxLines = config.get<number>('previewMaxLines', 20);

		// Check if cursor is over a snippet reference
		const offset = document.offsetAt(position);
		for (const location of locations) {
			if (offset >= location.startOffset && offset <= location.lineEndOffset) {
				const resolvedPath = this.resolver.resolve(
					location.snippet.path,
					document.uri.fsPath,
					workspaceRoot,
					basePath
				);

				if (!resolvedPath) {
					return undefined;
				}

				try {
					const content = this.readFile(resolvedPath);
					const contentStr = content.toString();

					// Truncate content if needed for hover display
					const lines = contentStr.split('\n');
					let displayContent = contentStr;
					if (lines.length > maxLines) {
						const visibleLines = lines.slice(0, maxLines);
						const hiddenCount = lines.length - maxLines;
						displayContent = visibleLines.join('\n') +
							`\n... (${hiddenCount} more ${hiddenCount === 1 ? 'line' : 'lines'})`;
					}

					// Create hover with preview
					const markdown = new vscode.MarkdownString();
					markdown.appendCodeblock(displayContent, '');

					return new vscode.Hover(markdown);
				} catch (error) {
					// File not readable
					return undefined;
				}
			}
		}

		return undefined;
	}
}
