# Test Coverage Strategy

This project enforces 100% test coverage through c8. However, some files are
excluded from standalone test coverage because they are tightly coupled to the
VS Code API.

## Coverage Architecture

The project follows a layered testing strategy:

### Layer 1: Pure Business Logic (100% Coverage via Standalone Tests)

These modules contain all core logic and have ZERO VS Code dependencies:

- `snippetDetector.ts` - Detects MkDocs snippet syntax using regex  
- `snippetLocator.ts` - Finds snippet positions in text
- `pathResolver.ts` - Resolves file paths with precedence logic
- `linkCreation.ts` - Creates link information from locations and paths
- `contentFormatter.ts` - Formats snippet content with line truncation
- `inlineFormatter.ts` - Converts newlines to inline display symbols

All business logic is tested in `src/test/standalone/**/*.test.ts` using plain
Mocha (no VS Code runtime), with coverage tracked by c8.

### Layer 2: VS Code Glue Code (Tested via Integration Tests)

These modules are thin wrappers that coordinate pure business logic with the VS
Code API:

- `snippetLinkProvider.ts` - Implements `vscode.DocumentLinkProvider` by
  delegating to layer 1 modules
- `previewManager.ts` - Manages ghost text decorations by delegating to layer 1
  modules
- `extension.ts` - Extension activation and registration boilerplate

These files are excluded from c8 standalone coverage because:

1. They import `vscode` module which can't be loaded in Node.js/Mocha
2. They contain minimal logic - mostly just gluing together Layer 1 components
3. They are thoroughly tested via integration tests in
   `src/test/unit/**/*.test.ts` which run in a real VS Code extension host

## Verification

To verify complete test coverage:

```bash
# Clean build output (recommended before running tests)
npm run clean

# Run standalone tests with c8 coverage (auto-cleans and compiles)
npm run test:unit
# or
npm test

# Run VS Code integration tests (auto-compiles)
npm run test:integration

# Run both (auto-cleans and compiles all)
npm run test:all
```

All test commands now automatically clean and compile before running, ensuring
stale compiled output never causes issues.

## Why This Approach?

This architecture provides:

1. ✅ **100% testable business logic** - All core functionality has genuine
   unit tests with coverage
2. ✅ **Fast test cycles** - Standalone tests run in <1s without launching VS
   Code
3. ✅ **TDD-friendly** - Can write tests and iterate quickly on business logic
4. ✅ **Integration verification** - VS Code glue is proven to work via real
   extension host tests
5. ✅ **No false coverage** - We don't mock `vscode` module or use coverage
   tricks

## What Gets Excluded?

Only thin VS Code API wrappers that:

- Have zero business logic (just coordinate other modules)
- Import the `vscode` module (cannot run in standalone Mocha)
- Are fully exercised by integration tests

If a file has business logic, it MUST be refactored to extract that logic into
a standalone testable module.
