# GitHub Copilot Instructions for MkDocs Snippet Lens

## Project Overview

MkDocs Snippet Lens is a VS Code extension that enhances the editing experience for MkDocs documentation by detecting `--8<--` snippet references, making them clickable, and providing inline previews of referenced content.

**Current Phase:** v0.1.0 MVP - Building core functionality

## Architecture & Module Organization

Follow a modular architecture with clear separation of concerns:

- **SnippetDetector** - Detects snippet syntax in markdown files using regex
- **PathResolver** - Resolves relative/absolute paths to referenced files
- **DocumentLinkProvider** - Provides clickable links for snippet references
- **PreviewManager** - Manages ghost text decorations for content previews
- **extension.ts** - Main entry point, coordinates all components

Each module should be in its own file under `src/` and have a corresponding test file.

## Coding Standards

### TypeScript
- Use strict TypeScript with no implicit any
- Prefer interfaces for public APIs, types for internal structures
- Use readonly for immutable properties
- Document public methods with JSDoc comments
- Include parameter descriptions and return types in JSDoc

### VS Code Extension Patterns
- Register all disposables with `context.subscriptions.push()`
- Use `vscode.workspace.getConfiguration()` for settings
- Handle errors gracefully with user-friendly messages
- Use VS Code theming colors (e.g., `editorCodeLens.foreground`)
- Follow VS Code API patterns and conventions

### Naming Conventions
- Classes: PascalCase (e.g., `SnippetDetector`)
- Interfaces: PascalCase with `I` prefix if needed (e.g., `ISnippetInfo`)
- Methods/functions: camelCase (e.g., `detectSnippets`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_PREVIEW_LINES`)
- Private members: prefix with underscore (e.g., `_cache`)

## Key Technical Details

### Snippet Detection (MVP)
Use this regex pattern for v0.1.0:
```
/--8<--\s+["']([^"']+)["']/g
```

**In Scope for MVP:**
- Simple file inclusion: `--8<-- "path/to/file"`
- Both single and double quotes
- Whole file inclusion only

**Out of Scope for MVP:**
- Named sections (`:section_name`)
- Line ranges (`:start:end`)
- Multiple ranges
- Recursive snippet expansion

### Path Resolution Precedence
Follow this exact order when resolving paths:

1. If path is absolute (starts with `/` or drive letter on Windows), use as-is
2. Try relative to current markdown file's directory
3. Try relative to workspace root
4. Try relative to configured `basePath` setting
5. If all fail, return undefined (caller handles error)

Document this precedence in code comments.

### Preview Behavior (MVP)
- Display first 20 lines of snippet content (hardcoded for MVP)
- Show truncation indicator if file exceeds limit: `... (XX more lines)`
- Use faded italic text with `editorCodeLens.foreground` color
- Global toggle only - OFF by default
- No per-snippet toggle in MVP

## Development Methodology

### Test Driven Development (TDD)

**This project strictly follows TDD practices. All code must be written using the Red-Green-Refactor cycle.**

#### TDD Workflow (Mandatory)

1. **RED** - Write a failing test
   - Write only enough of a test to fail
   - Run the test and verify it fails for the right reason
   - Do NOT write implementation yet

2. **GREEN** - Make the test pass
   - Write only enough code to make the test pass
   - No premature implementation or features
   - Simplest solution that works

3. **REFACTOR** - Improve the code
   - Clean up code while keeping tests green
   - Remove duplication
   - Improve readability

#### TDD Principles

- **Never write production code without a failing test first**
- **Write tests incrementally** - Small, focused tests that verify one thing
- **Highly iterative** - Many small cycles, not one big test then implementation
- **No implementation in advance** - Only write code when needed by a test
- **Tests drive design** - Let tests guide the API and architecture

#### Example TDD Session

```typescript
// Step 1: Write first failing test
test('should detect snippet with double quotes', () => {
  const detector = new SnippetDetector();
  const result = detector.detect('--8<-- "file.txt"');
  expect(result.length).toBe(1);
});

// Run test → RED (SnippetDetector doesn't exist)

// Step 2: Minimal code to pass
class SnippetDetector {
  detect(text: string) { return [{}]; }
}

// Run test → GREEN

// Step 3: Write next failing test
test('should extract file path from snippet', () => {
  const detector = new SnippetDetector();
  const result = detector.detect('--8<-- "file.txt"');
  expect(result[0].path).toBe('file.txt');
});

// Run test → RED (path is undefined)

// Step 4: Implement just enough to pass
class SnippetDetector {
  detect(text: string) {
    const match = /--8<--\s+"([^"]+)"/.exec(text);
    return match ? [{ path: match[1] }] : [];
  }
}

// Run test → GREEN
// Continue iterating...
```

## Testing Requirements

### Coverage Target
Maintain **100% code coverage** at all times through TDD practice.

**Enforcement:**
- Tests must fail if coverage falls below 100%
- CI builds must fail on insufficient coverage
- No code can be committed without 100% coverage

### Test Organization
- Unit tests in `src/test/unit/`
- Integration tests in `src/test/integration/`
- Use descriptive test names: `should detect snippet with double quotes`
- Group related tests with `describe` blocks
- Test edge cases: unicode paths, spaces, special characters, Windows paths

### Critical Test Cases
- Regex pattern matching (all quote variants)
- Path resolution precedence (test each fallback level)
- Content truncation logic
- Cross-platform path handling (Windows vs Unix)
- Error conditions (file not found, permission denied, etc.)

## Configuration Settings (MVP)

```typescript
{
  "mkdocsSnippetLens.enabled": boolean,        // default: true
  "mkdocsSnippetLens.basePath": string,        // default: ""
  "mkdocsSnippetLens.previewMaxLines": number  // default: 20
}
```

Access via `vscode.workspace.getConfiguration('mkdocsSnippetLens')`.

## Performance Considerations

### MVP Acceptable Limits
- Synchronous file loading is acceptable for MVP
- Document known limitation if >50 snippets cause lag
- No caching in v0.1.0 - re-scan on file open/save

### Future Optimization (v0.2+)
- Async file loading
- Content caching
- Incremental updates on typing

## Error Handling

- Never throw errors to VS Code - catch and handle gracefully
- Show diagnostics for file-not-found errors
- Log errors to output channel for debugging
- Provide user-friendly error messages
- Handle cross-platform path issues (drive letters, separators)

## Documentation

- Update CHANGELOG.md for all user-visible changes
- Keep README.md examples up-to-date
- Document limitations in README known issues section
- Use inline comments for complex logic
- Reference REQUIREMENTS.md sections when implementing features

## Key Documents

Always consult these before implementing features:
- **REQUIREMENTS.md** - Feature specifications and requirements
- **IMPLEMENTATION.md** - Phased development plan and MVP scope
- **RISKS.md** - Known risks and mitigation strategies

## Commands (MVP Scope)

For v0.1.0, implement only:
- `mkdocs-snippet-lens.toggleAllPreviews` - Toggle all previews on/off

Additional commands are scheduled for later releases per IMPLEMENTATION.md.

## Code Quality Checklist

Before committing, ensure:- [ ] **TDD process followed** - Tests written before implementation- [ ] All tests pass
- [ ] Code coverage == 100%
- [ ] No TypeScript errors (`npm run check-types`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] All disposables are registered
- [ ] Error handling is in place
- [ ] JSDoc comments for public APIs
- [ ] Cross-platform compatibility considered

## Current MVP Priorities

Focus on these in order:
1. Basic snippet detection (regex pattern matching)
2. Path resolution with proper precedence
3. DocumentLinkProvider for clickable links
4. Simple ghost text preview (20 lines, hardcoded)
5. Toggle all previews command
6. Unit tests for all modules (100% coverage required)

Avoid scope creep - defer advanced features to v0.2.0+ per IMPLEMENTATION.md.

## Git Commit Conventions

Follow Conventional Commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation only
- `test:` - Adding/updating tests
- `refactor:` - Code restructuring
- `chore:` - Build/tooling changes

Use commitlint for validation (already configured in project).
