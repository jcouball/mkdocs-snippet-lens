import * as vscode from 'vscode';
import * as fs from 'fs';
import { SnippetDetector } from './snippetDetector';
import { PathResolver } from './pathResolver';
import { SnippetLocator } from './snippetLocator';
import { createPreviewContent } from './previewContentCreator';

/**
 * Manages inline preview decorations for snippet references
 */
export class PreviewManager {
	private decorationType: vscode.TextEditorDecorationType;
	private enabled: boolean = true;

	constructor(
		private detector: SnippetDetector,
		private resolver: PathResolver,
		private locator: SnippetLocator,
		private readFile: (path: string) => string = fs.readFileSync as any
	) {
		// Create decoration type for inline previews
		this.decorationType = vscode.window.createTextEditorDecorationType({
			after: {
				margin: '0 0 0 1em',
				color: new vscode.ThemeColor('editorCodeLens.foreground')
			}
		});
	}

	/**
	 * Updates preview decorations for a document
	 */
	updatePreviews(document: vscode.TextDocument): void {
		const editor = vscode.window.activeTextEditor;
		if (!this.enabled || !editor || editor.document !== document) {
			return;
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
		const maxChars = config.get<number>('previewMaxChars', 200);

		const decorations: vscode.DecorationOptions[] = [];

		for (const location of locations) {
			const formattedContent = createPreviewContent(
				location,
				document.uri.fsPath,
				workspaceRoot,
				basePath,
				maxLines,
				maxChars,
				this.resolver,
				this.readFile
			);

			if (formattedContent !== undefined) {
				const snippetLine = document.positionAt(location.lineEndOffset).line;
				const lineEnd = document.lineAt(snippetLine).range.end;

				decorations.push({
					range: new vscode.Range(lineEnd, lineEnd),
					renderOptions: {
						after: {
							contentText: formattedContent
						}
					}
				});
			}
		}

		editor.setDecorations(this.decorationType, decorations);
	}

	/**
	 * Toggles preview visibility
	 */
	toggle(): void {
		this.enabled = !this.enabled;

		if (!this.enabled) {
			// Clear all decorations when disabled
			vscode.window.visibleTextEditors.forEach(editor => {
				editor.setDecorations(this.decorationType, []);
			});
		} else {
			// Refresh all visible markdown documents
			vscode.window.visibleTextEditors
				.filter(e => e.document.languageId === 'markdown')
				.forEach(e => this.updatePreviews(e.document));
		}
	}

	/**
	 * Returns whether previews are currently enabled
	 */
	isEnabled(): boolean {
		return this.enabled;
	}

	/**
	 * Disposes of resources
	 */
	dispose(): void {
		this.decorationType.dispose();
	}
}
