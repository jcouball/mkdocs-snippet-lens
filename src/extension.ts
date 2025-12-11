import * as vscode from 'vscode';
import { SnippetDetector } from './snippetDetector';
import { PathResolver } from './pathResolver';
import { SnippetLocator } from './snippetLocator';
import { SnippetLinkProvider } from './snippetLinkProvider';
import { PreviewManager } from './previewManager';
import { SnippetHoverProvider } from './snippetHoverProvider';

/**
 * Activates the mkdocs-snippet-lens extension
 */
export function activate(context: vscode.ExtensionContext) {
	// Create core service instances
	const detector = new SnippetDetector();
	const resolver = new PathResolver();
	const locator = new SnippetLocator();

	// Register document link provider for markdown files
	const linkProvider = new SnippetLinkProvider(detector, resolver, locator);
	const linkProviderDisposable = vscode.languages.registerDocumentLinkProvider(
		{ language: 'markdown', scheme: 'file' },
		linkProvider
	);

	// Create preview manager for inline decorations
	const previewManager = new PreviewManager(detector, resolver, locator);

	// Register hover provider for snippet previews
	const hoverProvider = new SnippetHoverProvider(detector, resolver, locator);
	const hoverDisposable = vscode.languages.registerHoverProvider(
		{ language: 'markdown', scheme: 'file' },
		hoverProvider
	);

	// Update previews when document changes
	const changeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
		if (event.document.languageId === 'markdown') {
			previewManager.updatePreviews(event.document);
		}
	});

	// Update previews when active editor changes
	const editorDisposable = vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor && editor.document.languageId === 'markdown') {
			previewManager.updatePreviews(editor.document);
		}
	});

	// Initial preview for currently open markdown files
	vscode.window.visibleTextEditors
		.filter(editor => editor.document.languageId === 'markdown')
		.forEach(editor => previewManager.updatePreviews(editor.document));

	// Register toggle command
	const toggleCommand = vscode.commands.registerCommand(
		'mkdocs-snippet-lens.toggleAllPreviews',
		() => {
			previewManager.toggle();
			const status = previewManager.isEnabled() ? 'enabled' : 'disabled';
			vscode.window.showInformationMessage(`MkDocs Snippet Lens: Previews ${status}`);
		}
	);

	context.subscriptions.push(
		linkProviderDisposable,
		previewManager,
		hoverDisposable,
		changeDisposable,
		editorDisposable,
		toggleCommand
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
