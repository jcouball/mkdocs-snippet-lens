# Implementation Plan: MkDocs Snippet Lens

This document outlines the phased implementation approach for the MkDocs Snippet Lens
VS Code extension. Features are prioritized to deliver value early while managing
complexity and risk.

- [About This Document](#about-this-document)
- [Release Strategy Overview](#release-strategy-overview)
- [v0.1.0 - Minimum Viable Product (MVP)](#v010---minimum-viable-product-mvp)
  - [Features In Scope](#features-in-scope)
    - [1. Basic Snippet Detection](#1-basic-snippet-detection)
    - [2. Document Link Provider](#2-document-link-provider)
    - [3. Simple Ghost Text Preview](#3-simple-ghost-text-preview)
    - [4. Basic Error Handling](#4-basic-error-handling)
    - [5. Basic Configuration](#5-basic-configuration)
  - [Development Tasks](#development-tasks)
  - [MVP Success Metrics](#mvp-success-metrics)
- [v0.2.0 - Enhanced Previews](#v020---enhanced-previews)
  - [Features In Scope](#features-in-scope-1)
    - [1. Named Section Support](#1-named-section-support)
    - [2. Line Range Support](#2-line-range-support)
    - [3. Per-Snippet Toggle](#3-per-snippet-toggle)
    - [4. Configurable Preview Length](#4-configurable-preview-length)
    - [5. Asynchronous File Loading](#5-asynchronous-file-loading)
  - [Development Tasks](#development-tasks-1)
- [v0.3.0 - Robustness](#v030---robustness)
  - [Features In Scope](#features-in-scope-2)
    - [1. Recursive Snippet Processing](#1-recursive-snippet-processing)
    - [2. Auto-Refresh on File Changes](#2-auto-refresh-on-file-changes)
    - [3. Comprehensive Error Handling](#3-comprehensive-error-handling)
    - [4. File Size Limits](#4-file-size-limits)
    - [5. State Persistence](#5-state-persistence)
  - [Development Tasks](#development-tasks-2)
- [v1.0.0 - Production Ready](#v100---production-ready)
  - [Features In Scope](#features-in-scope-3)
    - [1. Security Hardening](#1-security-hardening)
    - [2. Performance Optimization](#2-performance-optimization)
    - [3. Accessibility Features](#3-accessibility-features)
    - [4. Complete Documentation](#4-complete-documentation)
    - [5. Marketplace Publishing Automation](#5-marketplace-publishing-automation)
  - [Development Tasks](#development-tasks-3)
- [Command Implementation Schedule](#command-implementation-schedule)
  - [v0.1.0 - MVP Commands](#v010---mvp-commands)
  - [v0.2.0 - Enhanced Control Commands](#v020---enhanced-control-commands)
  - [v0.3.0 - Navigation \& Refresh Commands](#v030---navigation--refresh-commands)
  - [v1.1.0+ - Future Commands](#v110---future-commands)
- [Future Releases (v1.1.0+)](#future-releases-v110)
  - [Potential Features (Not Yet Scheduled)](#potential-features-not-yet-scheduled)
  - [Prioritization Criteria for Future Features](#prioritization-criteria-for-future-features)
  - [Feature Request Process](#feature-request-process)
- [Release Process](#release-process)
  - [Version Numbering](#version-numbering)
  - [Release Checklist](#release-checklist)
  - [Post-Release Activities](#post-release-activities)
- [Development Standards](#development-standards)
  - [Code Quality](#code-quality)
  - [Git Workflow](#git-workflow)
  - [Testing Strategy](#testing-strategy)
  - [Performance Budgets](#performance-budgets)
  - [Documentation Requirements](#documentation-requirements)
- [Risk Mitigation](#risk-mitigation)
- [Success Metrics](#success-metrics)
  - [Technical Metrics](#technical-metrics)
  - [User Metrics (Post-1.0)](#user-metrics-post-10)
  - [Project Health](#project-health)

## About This Document

This document defines **how and when** the requirements in `REQUIREMENTS.md` will be
implemented. It breaks the full feature set into manageable releases, prioritizing
features to deliver value incrementally while managing complexity and risk.

**Purpose:**

- Define release strategy and timelines
- Break requirements into phased milestones (v0.1, v0.2, v1.0, etc.)
- Prioritize features for each release
- Provide development task breakdown and scheduling
- Document technical implementation decisions and approaches
- Track progress toward completion

**What's Included:**

- Release roadmap with target dates and goals
- Feature scope for each release (what's in/out)
- Development task breakdowns by week/phase
- Success criteria for each milestone
- Command implementation schedule
- Development standards and practices
- Risk mitigation strategies specific to implementation

**What's NOT Included:**

- Detailed feature specifications (see `REQUIREMENTS.md`)
- Why features exist or user needs (see `REQUIREMENTS.md`)
- Completed implementation details (those go in code/comments)

**Relationship to Other Documents:**

- `REQUIREMENTS.md` - Defines **what** needs to be built and **why**
- `RISKS.md` - Identifies risks that inform prioritization and scheduling
- `CHANGELOG.md` - Records actual implementation history and releases
- GitHub Issues/Milestones - Track detailed tasks and bugs

**Maintenance:**

- Update actively during development as plans evolve
- Review and adjust after each release based on learnings
- Move completed releases to "Completed Releases" section
- Adjust future releases based on feedback and changing priorities
- More dynamic than REQUIREMENTS.md - expects frequent updates

**How to Use This Document:**

1. **Planning:** Review upcoming release to understand scope and timeline
2. **Development:** Check current phase for task breakdown and priorities
3. **Tracking:** Update task checkboxes as work progresses
4. **Retrospective:** After each release, update with learnings and adjust future
   plans
5. **Onboarding:** New contributors should read this to understand where the project
   is heading

---

**Guiding Principles:**

- Start simple, iterate based on feedback
- Deliver working software early and often
- Validate technical approaches before full implementation
- Build foundation for future features without over-engineering
- Maintain high quality (90%+ test coverage) throughout

---

## Release Strategy Overview

| Release | Target Date | Focus | Key Deliverables |
|---------|-------------|-------|------------------|
| v0.1.0 (MVP) | Week 4 | Core functionality proof-of-concept | Basic snippet detection, file links, simple previews |
| v0.2.0 | Week 8 | Enhanced previews | Named sections, line ranges, improved UX |
| v0.3.0 | Week 12 | Robustness | Recursive snippets, auto-refresh, error handling |
| v1.0.0 | Week 16 | Production ready | Security hardening, performance optimization, documentation |
| v1.1.0+ | Future | Advanced features | Multi-root workspaces, advanced settings, accessibility |

---

## v0.1.0 - Minimum Viable Product (MVP)

**Goal:** Prove the core concept works and delivers value to users. Establish
technical foundation.

**Timeline:** 4 weeks

**Success Criteria:**

- Users can click snippet references to open files
- Users can see basic ghost text previews
- Extension works on all three platforms (Windows, macOS, Linux)
- Code coverage ≥ 80%
- No critical bugs

### Features In Scope

#### 1. Basic Snippet Detection

**Description:** Detect simple `--8<-- "path/to/file"` syntax in markdown files.

**Requirements:**

- Pattern matching for entire file inclusion only
  - `--8<-- "path/to/file.ext"`
  - `--8<-- 'path/to/file.ext'`
  - Support both single and double quotes
- Trigger on file open and save only (no live typing detection)
- Scan only `.md` files
- Use basic regex pattern

**Out of Scope for v0.1:**

- Named sections (`:section_name`)
- Line ranges (`:start:end`)
- Multiple ranges (`:1:3,5:6`)
- Negative indexes
- Recursive snippet expansion

**Implementation Notes:**

- Regex: `/--8<--\s+["']([^"']+)["']/g`
- Store detected snippets with line numbers and file paths
- No caching in v0.1 - re-scan on each trigger

**Known Limitations (documented in README):**

- Does not handle escaped quotes inside paths: `--8<-- "path/with\"quote.md"`
- Does not handle paths with line breaks (unlikely but possible)
- These are acceptable for MVP; consider robust parser in v0.2+ if needed

**Testing:**

- Unit tests for regex pattern matching
- Edge cases: escaped quotes, unicode, spaces in paths
- Integration test: detect snippets in sample markdown file

#### 2. Document Link Provider

**Description:** Make snippet file paths clickable to open referenced files.

**Requirements:**

- Implement `DocumentLinkProvider` interface
- Extract file path from snippet syntax
- Create clickable link for entire quoted path
- Clicking opens file in new editor tab
- Show tooltip on hover: "Open snippet file"

**Path Resolution (Simple):**

- Try absolute path first
- Try relative to current file's directory
- Try relative to workspace root
- Try relative to configured `basePath` setting
- Show error diagnostic if file not found

**Resolution Precedence (document in code/README):**

1. If path is absolute (starts with `/` or drive letter on Windows), use as-is
2. Else try relative to current markdown file's directory
3. Else try relative to workspace root
4. Else try relative to configured `basePath`
5. If all fail, show diagnostic error

**Out of Scope for v0.1:**

- Opening to specific line numbers
- Preview on hover
- Path traversal protection (implement in v1.0)

**Implementation Notes:**

- Use `vscode.Uri.file()` for path resolution
- Handle file not found gracefully with diagnostic
- Document precedence order in code comments

**Testing:**

- Unit tests for path resolution logic
- Test precedence: what happens when same filename exists in multiple locations
- Integration tests for link provider registration
- Cross-platform path testing (Windows drive letters, Unix paths)

#### 3. Simple Ghost Text Preview

**Description:** Display snippet file content below the snippet line using text
decorations.

**Requirements:**

- Use `TextEditorDecorationType` with `after` property
- Display content as faded italic text
- Limit to first 20 lines (hardcoded in v0.1)
- Show truncation indicator if file > 20 lines: `... (XX more lines)`
- Manual toggle only - OFF by default
- Command: "MkDocs Snippet Lens: Toggle All Previews"

**Styling:**

- Use `editorCodeLens.foreground` theme color
- Font style: italic
- No fancy borders or margins in v0.1

**Out of Scope for v0.1:**

- Per-snippet toggle
- CodeLens toggle button
- State persistence
- Auto-refresh on file changes
- Configurable preview line limit

**Implementation Notes:**

- Single decoration type reused for all previews
- Global toggle state in memory only (lost on reload)
- Load file content synchronously for simplicity (optimize in v0.2)
- Handle file read errors with error message in preview
- **Note:** Week 1 spike will validate multi-line decoration approach; if `after`
  property has limitations, may need to use decoration ranges or alternative
  strategy

**Performance Considerations:**

- Synchronous loading acceptable for MVP but measure impact in Week 3
- If >50 snippets or files >100KB cause lag, document as known limitation
- Plan async loading for v0.2 based on Week 3 performance test results

**Testing:**

- Unit tests for content truncation logic
- Integration tests for decoration application
- Visual tests (manual) for styling
- Performance test: 50+ snippets with various file sizes (Week 3)

#### 4. Basic Error Handling

**Description:** Show diagnostic errors for common failure cases.

**Requirements:**

- Diagnostic (red squiggle) for file not found
- Error message: "Snippet file not found: 'path/to/file'"
- Clear diagnostics when file is opened or snippet is removed
- Show error in preview area instead of content

**Out of Scope for v0.1:**

- Permission denied errors
- Invalid path syntax validation
- Security validation (path traversal)
- Detailed error context chains

**Implementation Notes:**

- Use `DiagnosticCollection` for errors
- Create diagnostics for snippet path range only
- Update diagnostics on document change

**Testing:**

- Unit tests for diagnostic creation
- Integration tests verifying diagnostics appear in Problems panel

#### 5. Basic Configuration

**Description:** Minimal settings to make extension usable.

**Settings:**

```json
{
  "mkdocsLens.basePath": {
    "type": "string",
    "default": "${workspaceFolder}",
    "description": "Base path for resolving snippet references"
  },
  "mkdocsLens.enable": {
    "type": "boolean",
    "default": true,
    "description": "Enable/disable the extension"
  }
}
```

**Out of Scope for v0.1:**

- `previewLines` (hardcoded to 20)
- `defaultPreviewState` (hardcoded to off)
- `maxFileSize` (no limit in v0.1)
- All security settings

**Implementation Notes:**

- Use `workspace.getConfiguration('mkdocsLens')`
- React to configuration changes
- Validate `basePath` setting

**Testing:**

- Unit tests for configuration reading
- Integration tests for configuration changes

### Development Tasks

**Week 1: Foundation**

- [ ] Set up project structure and build system
- [ ] Configure TypeScript, ESLint, testing framework
- [ ] Set up GitHub Actions for CI (lint, type check, tests)
- [ ] Spike: Validate multi-line decoration rendering approach with TextEditorDecorationType
- [ ] Define extension activation events in package.json (onLanguage:markdown)
- [ ] Document path resolution precedence order (absolute → relative to file → workspace root)
- [ ] Configure release-please for version management
- [ ] Implement snippet detection regex and parser
- [ ] Unit tests for pattern matching (including escaped quotes, unicode, spaces in paths)

**Week 2: Core Features**

- [ ] Implement Document Link Provider
- [ ] Implement basic path resolution
- [ ] Implement ghost text decoration rendering
- [ ] Implement command: `mkdocsLens.toggleAllPreviews`

**Week 3: Polish & Testing**

- [ ] Implement diagnostic error handling
- [ ] Add configuration settings
- [ ] Integration tests on all platforms (GitHub Actions matrix: Windows, macOS, Linux)
- [ ] Performance testing with 50+ snippets in one file
- [ ] Test with large snippet files (1MB+)
- [ ] Document manual test scenarios checklist:
  - Large files (>20 lines)
  - Missing files
  - Various path types (absolute, relative, workspace-relative)
  - Toggle command behavior
  - Empty/single-line files
  - Path resolution precedence edge cases
- [ ] Fix bugs, improve error messages

**Week 4: Documentation & Release**

- [ ] Create test fixtures repository/folder for manual testing
- [ ] Record demo GIF/video for README
- [ ] Write README with:
  - Installation instructions
  - Basic usage example with screenshots
  - Configuration reference
  - Known limitations (regex edge cases, synchronous loading)
  - Contributing/license info
- [ ] Manual testing on all platforms (follow documented checklist from Week 3)
- [ ] Verify CI/CD pipeline working
- [ ] Merge release-please PR for v0.1.0
- [ ] Verify GitHub release created automatically

### MVP Success Metrics

- ✅ Extension activates without errors
- ✅ Snippets detected in markdown files
- ✅ Click to open works for absolute and relative paths
- ✅ Ghost text preview shows content (when toggled on)
- ✅ File not found errors appear as diagnostics
- ✅ Works on Windows, macOS, Linux
- ✅ Test coverage ≥ 80%

---

## v0.2.0 - Enhanced Previews

**Goal:** Add advanced snippet syntax support and improve user experience.

**Timeline:** 4 weeks (Weeks 5-8)

**Success Criteria:**

- Named sections work correctly
- Line ranges work correctly
- Per-snippet toggles implemented
- Test coverage ≥ 85%

### Features In Scope

#### 1. Named Section Support

**Description:** Support `--8<-- "file.ext:section_name"` syntax.

**Requirements:**

- Detect section specifier in snippet syntax
- Parse snippet files for `--8<-- [start:name]` and `--8<-- [end:name]` markers
- Extract content between markers (excluding marker lines)
- Show diagnostic if section not found
- Support sections in comments (language-aware detection)

**Implementation Notes:**

- Extend regex to capture optional `:section_name`
- Create section marker parser
- Cache parsed sections per file

**Testing:**

- Unit tests for section marker detection
- Test various comment styles (Python, JavaScript, YAML, etc.)
- Test missing/mismatched section markers

#### 2. Line Range Support

**Description:** Support `--8<-- "file.ext:start:end"` syntax.

**Requirements:**

- Single line to end: `file.ext:5`
- Start to line: `file.ext::10`
- Specific range: `file.ext:5:10`
- 1-based line numbers (0 clamped to 1)
- Show diagnostic if range out of bounds

**Out of Scope for v0.2:**

- Multiple ranges (`:1:3,5:6`)
- Negative indexes (`:−5`)

**Implementation Notes:**

- Extend regex to capture line range specifiers
- Implement line extraction logic
- Validate ranges against file length

**Testing:**

- Unit tests for all line range variations
- Edge cases: empty ranges, invalid ranges, EOF

#### 3. Per-Snippet Toggle

**Description:** Toggle individual snippet previews independently.

**Requirements:**

- CodeLens above each snippet line
- Label: "👁 Show Snippet" / "👁 Hide Snippet"
- Click to toggle that specific preview
- State persists during editor session

**Commands Implemented:**

- `mkdocsLens.toggleCurrentPreview` - Toggle preview at cursor position

**Implementation Notes:**

- Implement `CodeLensProvider`
- Track toggle state per snippet (Map of line numbers)
- Update only affected decorations on toggle
- Set context key `mkdocsLens:hasSnippetAtCursor` when cursor is on snippet line

**Testing:**

- Integration tests for CodeLens provider
- Test state management
- Test multiple snippets in same file
- Test context key updates

#### 4. Configurable Preview Length

**Description:** Make preview line limit configurable.

**Settings:**

```json
{
  "mkdocsLens.previewLines": {
    "type": "number",
    "default": 20,
    "minimum": 5,
    "maximum": 500,
    "description": "Maximum lines to show in snippet preview"
  }
}
```

**Implementation Notes:**

- Replace hardcoded 20 with setting value
- React to configuration changes
- Update all visible previews when setting changes

**Testing:**

- Unit tests for truncation with various limits
- Integration tests for configuration updates

#### 5. Asynchronous File Loading

**Description:** Load snippet files asynchronously to avoid blocking UI.

**Requirements:**

- Use `workspace.fs.readFile()` (async)
- Show loading indicator in preview: "Loading..."
- Use cancellation tokens
- Handle concurrent requests properly

**Implementation Notes:**

- Implement async/await pattern
- Cache loaded content with TTL
- Debounce rapid toggle requests

**Testing:**

- Unit tests with mocked file system
- Test cancellation behavior
- Test race conditions

### Development Tasks

**Week 5: Named Sections**

- [ ] Implement section marker parser
- [ ] Extend snippet detection for sections
- [ ] Add section extraction logic
- [ ] Unit tests for sections

**Week 6: Line Ranges**

- [ ] Extend snippet detection for line ranges
- [ ] Implement line extraction logic
- [ ] Add range validation
- [ ] Unit tests for line ranges

**Week 7: Enhanced UX**

- [ ] Implement CodeLens provider
- [ ] Per-snippet toggle state management
- [ ] Implement commands: `mkdocsLens.showAllPreviews`, `mkdocsLens.hideAllPreviews`
- [ ] Implement command: `mkdocsLens.toggleCurrentPreview`
- [ ] Implement command: `mkdocsLens.refreshAllPreviews`
- [ ] Set context keys: `mkdocsLens:hasSnippetAtCursor`, `mkdocsLens:hasSnippets`
- [ ] Configurable preview lines
- [ ] Async file loading

**Week 8: Polish & Release**

- [ ] Integration tests
- [ ] Bug fixes
- [ ] Update documentation
- [ ] Create v0.2.0 release

---

## v0.3.0 - Robustness

**Goal:** Add recursive snippet support, auto-refresh, and comprehensive error
handling.

**Timeline:** 4 weeks (Weeks 9-12)

**Success Criteria:**

- Recursive snippets work without crashes
- File changes trigger preview updates
- All error conditions properly handled
- Test coverage ≥ 90%

### Features In Scope

#### 1. Recursive Snippet Processing

**Description:** Expand nested snippet references in previews.

**Requirements:**

- Process `--8<--` directives in snippet files recursively
- Maximum depth: 100 levels
- Circular reference detection
- Show error for circular references
- Maintain processing chain for error context

**Implementation Notes:**

- Implement recursive snippet expander
- Track visited files with normalized paths
- Add depth counter
- Timeout protection (5 seconds max)

**Testing:**

- Unit tests for circular detection
- Test various depth levels
- Test mixed valid/circular references
- Fuzz testing with random chains

#### 2. Auto-Refresh on File Changes

**Description:** Update previews when snippet files are modified.

**Requirements:**

- Watch referenced snippet files using `FileSystemWatcher`
- Invalidate cache when files change
- Re-render affected previews
- Handle dependency chains (A includes B includes C)
- Debounce rapid changes (500ms)

**Implementation Notes:**

- Create watchers for all referenced files
- Track reverse dependencies (which files include which)
- Dispose watchers when not needed
- Limit concurrent watchers (resource management)

**Testing:**

- Integration tests with file modifications
- Test dependency chain updates
- Test debouncing behavior

#### 3. Comprehensive Error Handling

**Description:** Handle all error conditions specified in requirements.

**Requirements:**

- Missing files
- Permission denied
- Invalid path syntax
- Invalid section specifications
- Line ranges out of bounds
- Unsaved file warnings
- Proper error context chains for recursive snippets

**Implementation Notes:**

- Standardize error message formatting
- Implement error context tracking
- Create diagnostic for each error type
- Log errors to output channel

**Testing:**

- Unit tests for each error condition
- Integration tests verifying diagnostics
- Test error messages format

#### 4. File Size Limits

**Description:** Prevent loading extremely large files.

**Settings:**

```json
{
  "mkdocsLens.maxFileSize": {
    "type": "number",
    "default": 1048576,
    "description": "Maximum file size in bytes (default 1MB)"
  }
}
```

**Requirements:**

- Check file size before loading
- Show warning if file exceeds limit
- Display in preview: "File too large (X MB). Limit: Y MB."
- Don't crash or hang on large files

**Implementation Notes:**

- Use `fs.stat()` to check size before reading
- Enforce timeout on file reads (5 seconds)

**Testing:**

- Unit tests with various file sizes
- Test with files at/near/over limit

#### 5. State Persistence

**Description:** Remember preview state across VS Code sessions.

**Settings:**

```json
{
  "mkdocsLens.defaultPreviewState": {
    "type": "string",
    "enum": ["on", "off", "remember"],
    "default": "off",
    "description": "Default preview state"
  }
}
```

**Requirements:**

- "on": All previews shown by default
- "off": All previews hidden by default
- "remember": Restore last global toggle state per workspace
- Use workspace state storage

**Implementation Notes:**

- Use `context.workspaceState` API
- Store per-document or per-workspace
- Restore on document open

**Testing:**

- Integration tests for state persistence
- Test all three modes
- Test workspace changes

### Development Tasks

**Week 9: Recursive Processing**

- [ ] Implement recursive snippet expander
- [ ] Circular reference detection
- [ ] Error context tracking
- [ ] Extensive testing

**Week 10: Auto-Refresh**

- [ ] Implement file system watchers
- [ ] Dependency tracking
- [ ] Cache invalidation
- [ ] Debouncing logic
- [ ] Implement commands: `mkdocsLens.refreshCurrentPreview`

**Week 11: Error Handling**

- [ ] All error types implemented
- [ ] File size limits
- [ ] Improved error messages
- [ ] State persistence
- [ ] Implement commands: `mkdocsLens.goToNextSnippet`,
  `mkdocsLens.goToPreviousSnippet`

**Week 12: Testing & Release**

- [ ] Achieve 90% test coverage
- [ ] Cross-platform testing
- [ ] Performance testing
- [ ] Create v0.3.0 release

---

## v1.0.0 - Production Ready

**Goal:** Security hardening, performance optimization, complete documentation. Ready
for marketplace publication.

**Timeline:** 4 weeks (Weeks 13-16)

**Success Criteria:**

- All security requirements met
- Performance targets achieved (< 50ms sync, < 200ms perceived)
- Full documentation complete
- Test coverage ≥ 90%
- CI/CD pipeline operational
- Published to VS Code Marketplace

### Features In Scope

#### 1. Security Hardening

**Requirements:**

- Path traversal protection (workspace boundary enforcement)
- Symlink handling with security validation
- `enablePathTraversalProtection` setting (default: true)
- `followSymlinks` setting (default: true)
- Security logging to output channel
- Code security review

**Implementation Notes:**

- Normalize and validate all resolved paths
- Implement symlink resolution with depth limits
- Detect circular symlinks
- Log all blocked access attempts

**Testing:**

- Security-focused unit tests
- Penetration testing with malicious paths
- Symlink attack scenarios

#### 2. Performance Optimization

**Requirements:**

- Meet performance targets from requirements
- Implement LRU cache (100 entries or 10MB)
- Limit concurrent file I/O (10 max)
- Incremental processing
- Memory usage < 50MB typical, < 200MB max

**Implementation Notes:**

- Profile extension with DevTools
- Optimize hot paths
- Implement request coalescing
- Use incremental document parsing

**Testing:**

- Performance benchmarks
- Load testing with many snippets
- Memory profiling

#### 3. Accessibility Features

**Requirements:**

- Hover provider showing snippet content
- Screen reader compatible
- High contrast theme support
- Keyboard navigation for all features
- Status announcements for toggles

**Implementation Notes:**

- Implement `HoverProvider`
- Use theme colors exclusively
- Test with screen readers
- Add ARIA labels where applicable

**Testing:**

- Manual testing with NVDA/JAWS/VoiceOver
- High contrast theme testing
- Keyboard-only workflow testing

#### 4. Complete Documentation

**Requirements:**

- README with screenshots/GIFs
- CHANGELOG
- LICENSE (MIT)
- Contributing guidelines (basic)
- Code documentation (JSDoc)

**Implementation Notes:**

- Create high-quality screenshots
- Record demo GIFs
- Document all settings
- Include troubleshooting section

#### 5. Marketplace Publishing Automation

**Requirements:**

- Automated marketplace publishing on release
- VSCE integration with GitHub Actions
- .vsix upload to GitHub releases
- Pre-publish validation checks

**Implementation Notes:**

- Extend existing release workflow with publish job
- Configure VSCE_PAT secret in repository
- Test marketplace publish in fork/staging
- Document manual publish fallback process

**Testing:**

- Dry-run marketplace publish with --dry-run flag
- Test .vsix installation locally
- Verify all marketplace metadata

### Development Tasks

**Week 13: Security**

- [ ] Implement path traversal protection
- [ ] Symlink security handling
- [ ] Security testing and review
- [ ] Security logging

**Week 14: Performance**

- [ ] Performance profiling
- [ ] Implement caching
- [ ] Optimize critical paths
- [ ] Memory optimization

**Week 15: Accessibility & Docs**

- [ ] Implement accessibility features
- [ ] Complete README with visuals
- [ ] Write contributing guidelines
- [ ] Code documentation review

**Week 16: Marketplace Publishing & Release**

- [ ] Configure VSCE_PAT secret
- [ ] Add marketplace publish job to release workflow
- [ ] Test publish workflow in staging
- [ ] Publish v1.0.0 to marketplace
- [ ] Verify marketplace listing

---

## Command Implementation Schedule

This section maps the commands defined in [REQUIREMENTS.md Section
2.5](REQUIREMENTS.md#25-feature-command-palette-commands) to their implementation
phases.

### v0.1.0 - MVP Commands

**Essential for basic functionality:**

- `mkdocsLens.toggleAllPreviews` - Core command for showing/hiding all previews

**Rationale:** Start with single toggle command to prove concept and get user
feedback.

### v0.2.0 - Enhanced Control Commands

**Added for better UX:**

- `mkdocsLens.showAllPreviews` - Explicit show (clearer intent than toggle)
- `mkdocsLens.hideAllPreviews` - Explicit hide (clearer intent than toggle)
- `mkdocsLens.toggleCurrentPreview` - Per-snippet control via CodeLens
- `mkdocsLens.refreshAllPreviews` - Manual refresh capability

**Context Keys Implemented:**

- `mkdocsLens:hasSnippetAtCursor` - Enables commands for current snippet
- `mkdocsLens:hasSnippets` - Enables document-level commands

**Rationale:** Users need granular control. Explicit show/hide commands avoid
confusion about toggle state.

### v0.3.0 - Navigation & Refresh Commands

**Added for workflow efficiency:**

- `mkdocsLens.refreshCurrentPreview` - Refresh single snippet
- `mkdocsLens.goToNextSnippet` - Navigate forward through snippets
- `mkdocsLens.goToPreviousSnippet` - Navigate backward through snippets

**Rationale:** Navigation commands improve productivity when working with many
snippets. Targeted refresh reduces unnecessary reloads.

### v1.1.0+ - Future Commands

**Deferred for user feedback:**

- `mkdocsLens.copySnippetContent` - Accessibility feature for screen readers
- `mkdocsLens.openSnippetBeside` - Power user feature for split editing
- `mkdocsLens.clearCache` - Debug/troubleshooting utility
- `mkdocsLens.showOutputChannel` - Debug/troubleshooting utility

**Rationale:** Prioritize core functionality first. Add utility commands based on
user requests and issues.

---

## Future Releases (v1.1.0+)

### Potential Features (Not Yet Scheduled)

**Advanced Syntax Support:**

- Multiple line ranges: `file.ext:1:3,5:6`
- Negative indexes: `file.ext:-5`
- More complex range expressions

**Multi-Root Workspace Support:**

- Cross-folder snippet references
- Folder-specific configuration
- Workspace-wide snippet search

**Enhanced UX:**

- Inline decorations showing snippet type (section, lines, etc.)
- Quick fix actions for errors
- Snippet content search
- Copy snippet to clipboard command

**Advanced Settings:**

- Custom snippet syntax patterns
- Preview styling customization
- File type filters
- Ignore patterns

**Performance:**

- Virtual scrolling for large previews
- Incremental syntax highlighting
- Worker threads for heavy processing

**Accessibility:**

- Alternative text for all visual elements
- Customizable announcements
- Enhanced screen reader support

**Developer Experience:**

- API for other extensions to use snippet parser
- Extension point for custom snippet processors
- Telemetry (opt-in) for usage analytics

### Prioritization Criteria for Future Features

1. **User demand** - requested by multiple users
2. **Value delivered** - high impact on productivity
3. **Implementation cost** - effort required
4. **Risk** - technical complexity and potential issues
5. **Strategic fit** - aligns with extension vision

### Feature Request Process

1. User submits GitHub issue with feature request template
2. Maintainer reviews and labels (enhancement, needs-discussion, etc.)
3. Community discussion and voting (thumbs up)
4. Prioritization in quarterly planning
5. Assignment to milestone (v1.1, v1.2, etc.)
6. Implementation and release

---

## Release Process

### Version Numbering

Follow **Semantic Versioning (SemVer)**:

- **MAJOR** (1.0.0): Breaking changes (rare)
- **MINOR** (1.1.0): New features, backwards compatible
- **PATCH** (1.0.1): Bug fixes

Pre-1.0 versions (0.x.y):

- MINOR for features
- PATCH for bug fixes
- Breaking changes allowed without major bump

### Release Checklist

Before each release:

- [ ] All planned features complete
- [ ] Test coverage ≥ 90% (or ≥ 80% for MVP)
- [ ] All tests passing on all platforms
- [ ] No known critical bugs
- [ ] CHANGELOG updated
- [ ] README updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] GitHub release created
- [ ] Marketplace updated (v1.0+)

### Post-Release Activities

- [ ] Monitor GitHub issues for bug reports
- [ ] Check marketplace reviews
- [ ] Monitor telemetry (if implemented)
- [ ] Announce on social media/communities
- [ ] Plan next iteration

---

## Development Standards

### Code Quality

- **TypeScript:** Strict mode enabled
- **Linting:** ESLint with recommended rules
- **Formatting:** Prettier (or consistent manual formatting)
- **Testing:** 90% coverage target (80% for MVP)
- **Documentation:** JSDoc for all public APIs

### Git Workflow

- **Branch:** Feature branches from main (`feat/snippet-detection`)
- **Commits:** Conventional Commits format
- **PR:** Required for all changes, self-review thoroughly
- **Main:** Always deployable, protected branch

### Testing Strategy

- **Unit tests:** 70-80% of test suite
- **Integration tests:** 15-25% of test suite
- **E2E tests:** 5-10% of test suite
- **Manual testing:** Before each release, all platforms

### Performance Budgets

- **Activation time:** < 500ms
- **Sync operations:** < 50ms
- **User-perceived actions:** < 200ms
- **Memory footprint:** < 50MB typical, < 200MB max
- **Extension size:** < 5MB

### Documentation Requirements

- **Code comments:** For complex logic, security-critical code
- **JSDoc:** All exported functions/classes
- **README:** Up-to-date with features and screenshots
- **CHANGELOG:** Updated with every release
- **Implementation.md:** Updated as plans change

---

## Risk Mitigation

Refer to [RISKS.md](RISKS.md) for comprehensive risk assessment.

**Key Risks to Monitor:**

1. **VS Code API limitations** - Prototype early
2. **Performance issues** - Profile and optimize continuously
3. **Scope creep** - Stick to plan, defer features to later versions
4. **Security vulnerabilities** - Review code carefully, use security tools
5. **Low adoption** - Focus on quality and user experience

---

## Success Metrics

### Technical Metrics

- Test coverage ≥ 90%
- Performance targets met
- Zero critical bugs in production
- Clean security audit

### User Metrics (Post-1.0)

- 1,000+ installations in first 3 months
- 4+ star average rating
- < 10% negative reviews
- Active issue engagement (responses within 48 hours)

### Project Health

- Regular releases (monthly or quarterly)
- Maintainable codebase (low technical debt)
- Sustainable maintenance burden
- Positive community engagement

---

**Document Version:** 1.0 **Last Updated:** December 10, 2025 **Next Review:** After
v0.1.0 release
