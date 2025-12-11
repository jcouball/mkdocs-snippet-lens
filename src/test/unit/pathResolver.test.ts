import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { PathResolver } from '../../pathResolver';

describe('PathResolver', () => {
	describe('resolve', () => {
		it('should return absolute path as-is', () => {
			const resolver = new PathResolver();
			const absolutePath = '/absolute/path/to/file.txt';
			const result = resolver.resolve(absolutePath, '/some/markdown/file.md', '/workspace', '');

			assert.strictEqual(result, absolutePath);
		});

		it('should resolve path relative to markdown file directory when file exists', () => {
			const resolver = new PathResolver((p) => p.includes('docs/snippet.txt'));
			const snippetPath = 'snippet.txt';
			const markdownFile = '/workspace/docs/guide.md';
			const result = resolver.resolve(snippetPath, markdownFile, '/workspace', '');

			assert.strictEqual(result, '/workspace/docs/snippet.txt');
		});

		it('should fall back to workspace root when file not found relative to markdown', () => {
			const resolver = new PathResolver((p) => p === '/workspace/snippet.txt');
			const snippetPath = 'snippet.txt';
			const markdownFile = '/workspace/docs/guide.md';
			const result = resolver.resolve(snippetPath, markdownFile, '/workspace', '');

			assert.strictEqual(result, '/workspace/snippet.txt');
		});

		it('should fall back to basePath when not found in workspace root', () => {
			const resolver = new PathResolver((p) => p === '/snippets/snippet.txt');
			const snippetPath = 'snippet.txt';
			const markdownFile = '/workspace/docs/guide.md';
			const result = resolver.resolve(snippetPath, markdownFile, '/workspace', '/snippets');

			assert.strictEqual(result, '/snippets/snippet.txt');
		});

		it('should return undefined when file not found in any location', () => {
			const resolver = new PathResolver(() => false);
			const snippetPath = 'nonexistent.txt';
			const markdownFile = '/workspace/docs/guide.md';
			const result = resolver.resolve(snippetPath, markdownFile, '/workspace', '');

			assert.strictEqual(result, undefined);
		});
	});
});
