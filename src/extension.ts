import * as vscode from 'vscode';
import { SnippetDetector } from './snippetDetector';
import { PathResolver } from './pathResolver';
import { SnippetLocator } from './snippetLocator';
import { SnippetLinkProvider } from './snippetLinkProvider';

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
	
	context.subscriptions.push(linkProviderDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
