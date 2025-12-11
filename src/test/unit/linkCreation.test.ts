import { describe, it } from 'mocha';
import * as assert from 'assert';
import { createLinkInfos, LinkInfo } from '../../linkCreation';

describe('Link Creation Logic', () => {
	it('should create link infos for valid paths', () => {
		const locations = [
			{
				snippet: { path: 'file1.txt' },
				startOffset: 10,
				endOffset: 19,
			},
			{
				snippet: { path: 'file2.txt' },
				startOffset: 30,
				endOffset: 39,
			},
		];

		const resolvePath = (path: string) => `/resolved/${path}`;

		const linkInfos = createLinkInfos(locations, resolvePath);

		assert.strictEqual(linkInfos.length, 2);
		assert.strictEqual(linkInfos[0].path, 'file1.txt');
		assert.strictEqual(linkInfos[0].resolvedPath, '/resolved/file1.txt');
		assert.strictEqual(linkInfos[0].startOffset, 10);
		assert.strictEqual(linkInfos[0].endOffset, 19);
	});

	it('should skip locations where path cannot be resolved', () => {
		const locations = [
			{
				snippet: { path: 'valid.txt' },
				startOffset: 10,
				endOffset: 19,
			},
			{
				snippet: { path: 'invalid.txt' },
				startOffset: 30,
				endOffset: 41,
			},
		];

		const resolvePath = (path: string) =>
			path === 'valid.txt' ? '/resolved/valid.txt' : undefined;

		const linkInfos = createLinkInfos(locations, resolvePath);

		assert.strictEqual(linkInfos.length, 1);
		assert.strictEqual(linkInfos[0].path, 'valid.txt');
	});

	it('should return empty array for empty locations', () => {
		const linkInfos = createLinkInfos([], () => '/resolved');
		assert.strictEqual(linkInfos.length, 0);
	});

	it('should return empty array when no paths resolve', () => {
		const locations = [
			{
				snippet: { path: 'file1.txt' },
				startOffset: 10,
				endOffset: 19,
			},
		];

		const linkInfos = createLinkInfos(locations, () => undefined);

		assert.strictEqual(linkInfos.length, 0);
	});
});
