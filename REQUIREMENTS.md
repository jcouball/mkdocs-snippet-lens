# Project Requirements: MkDocs Snippet Previewer

This is a fantastic productivity booster for documentation workflows. The default
MkDocs editing experience often involves a lot of context switching; bringing that
content directly into the editor is a high-value feature.

- [About This Document](#about-this-document)
- [1. Project Overview](#1-project-overview)
  - [1.1 Assumptions](#11-assumptions)
- [2. Functional Requirements](#2-functional-requirements)
  - [2.1 Snippet Detection](#21-snippet-detection)
  - [2.2 Feature: Open Referenced File](#22-feature-open-referenced-file)
  - [2.3 Feature: Content Preview ("Ghost Text")](#23-feature-content-preview-ghost-text)
  - [2.4 Feature: Hover Tooltips](#24-feature-hover-tooltips)
  - [2.5 Feature: Error Handling](#25-feature-error-handling)
    - [2.5.1 Missing Files](#251-missing-files)
    - [2.4.2 Invalid Path Syntax](#242-invalid-path-syntax)
    - [2.4.3 Permission Denied](#243-permission-denied)
    - [2.4.4 Invalid Section Specification](#244-invalid-section-specification)
    - [2.4.5 Unsaved File with Relative Paths](#245-unsaved-file-with-relative-paths)
  - [2.5 Feature: Command Palette Commands](#25-feature-command-palette-commands)
    - [2.5.1 Preview Control Commands](#251-preview-control-commands)
      - [Toggle All Previews](#toggle-all-previews)
      - [Show All Previews](#show-all-previews)
      - [Hide All Previews](#hide-all-previews)
      - [Toggle Current Preview](#toggle-current-preview)
      - [Refresh All Previews](#refresh-all-previews)
      - [Refresh Current Preview](#refresh-current-preview)
    - [2.5.2 Navigation Commands](#252-navigation-commands)
      - [Go to Next Snippet](#go-to-next-snippet)
      - [Go to Previous Snippet](#go-to-previous-snippet)
    - [2.5.3 Accessibility \& Utility Commands](#253-accessibility--utility-commands)
      - [Copy Snippet Content](#copy-snippet-content)
      - [Open Snippet File to Side](#open-snippet-file-to-side)
      - [Clear Cache](#clear-cache)
      - [Show Output Channel](#show-output-channel)
    - [2.5.4 Context Keys](#254-context-keys)
    - [2.5.5 Keybinding Strategy](#255-keybinding-strategy)
    - [2.5.6 Command Implementation Requirements](#256-command-implementation-requirements)
- [3. Configuration Settings](#3-configuration-settings)
  - [3.1 Configuration Validation](#31-configuration-validation)
- [4. Non-Functional Requirements](#4-non-functional-requirements)
  - [4.1 Platform \& Environment](#41-platform--environment)
  - [4.2 Security Requirements](#42-security-requirements)
  - [4.3 Reliability Requirements](#43-reliability-requirements)
  - [4.4 Internationalization (i18n)](#44-internationalization-i18n)
  - [4.5 Memory Usage Limits](#45-memory-usage-limits)
- [5. Technical Specifications \& Constraints](#5-technical-specifications--constraints)
  - [5.1 "Ghost Text" Implementation Strategy](#51-ghost-text-implementation-strategy)
    - [5.1.1 Ghost Text Styling](#511-ghost-text-styling)
    - [5.1.2 Decoration Interaction with Other Extensions](#512-decoration-interaction-with-other-extensions)
  - [5.2 Path Resolution Logic](#52-path-resolution-logic)
    - [5.2.1 Untitled/Unsaved File Handling](#521-untitledunsaved-file-handling)
  - [5.3 Multi-Root Workspace Support](#53-multi-root-workspace-support)
  - [5.4 Performance Requirements](#54-performance-requirements)
  - [5.4.1 Performance Degradation and Graceful Failure](#541-performance-degradation-and-graceful-failure)
  - [5.5 Extension Activation](#55-extension-activation)
  - [5.5.1 Extension Lifecycle and Resource Management](#551-extension-lifecycle-and-resource-management)
  - [5.5.2 Workspace State Persistence](#552-workspace-state-persistence)
  - [5.6 Accessibility Requirements](#56-accessibility-requirements)
    - [5.6.1 Visual Accessibility](#561-visual-accessibility)
    - [5.5.2 Screen Reader Support](#552-screen-reader-support)
    - [5.5.3 Keyboard Navigation](#553-keyboard-navigation)
    - [5.5.4 Status Announcements](#554-status-announcements)
    - [5.5.5 Cognitive Accessibility](#555-cognitive-accessibility)
    - [5.5.6 Motion and Animation](#556-motion-and-animation)
    - [5.5.7 Testing Requirements](#557-testing-requirements)
  - [5.7 Success Metrics](#57-success-metrics)
    - [5.7.1 Performance Metrics](#571-performance-metrics)
    - [5.7.2 Code Quality Metrics](#572-code-quality-metrics)
    - [5.7.3 Functional Correctness Metrics](#573-functional-correctness-metrics)
    - [5.7.4 Security Metrics](#574-security-metrics)
    - [5.7.5 Release Quality Metrics](#575-release-quality-metrics)
    - [5.7.6 Development Velocity Metrics](#576-development-velocity-metrics)
    - [5.7.7 Measurement and Reporting Strategy](#577-measurement-and-reporting-strategy)
- [6. User Stories](#6-user-stories)
- [7. Documentation Requirements](#7-documentation-requirements)
  - [7.1 User Documentation](#71-user-documentation)
    - [7.1.1 README.md (Required)](#711-readmemd-required)
    - [7.1.2 CHANGELOG.md (Required)](#712-changelogmd-required)
    - [7.1.3 Visual Assets (Required for README)](#713-visual-assets-required-for-readme)
  - [7.2 Developer Documentation](#72-developer-documentation)
    - [7.2.1 Inline Code Documentation (Required)](#721-inline-code-documentation-required)
    - [7.2.2 Architecture Documentation (Optional for v1.0)](#722-architecture-documentation-optional-for-v10)
  - [7.3 Contribution Documentation](#73-contribution-documentation)
    - [7.3.1 CONTRIBUTING.md (Optional for v1.0)](#731-contributingmd-optional-for-v10)
  - [7.4 Marketplace Listing (Required for Publication)](#74-marketplace-listing-required-for-publication)
  - [7.5 Documentation Maintenance](#75-documentation-maintenance)
  - [7.6 Documentation Quality Standards](#76-documentation-quality-standards)
- [8. Testing Requirements](#8-testing-requirements)
  - [8.1 Coverage Targets](#81-coverage-targets)
  - [8.2 Test Types](#82-test-types)
    - [8.2.1 Unit Tests (70-80% of test suite)](#821-unit-tests-70-80-of-test-suite)
    - [8.2.2 Integration Tests (15-25% of test suite)](#822-integration-tests-15-25-of-test-suite)
    - [8.2.3 End-to-End Tests (5-10% of test suite)](#823-end-to-end-tests-5-10-of-test-suite)
  - [8.3 Test Fixtures](#83-test-fixtures)
  - [8.4 Mocking Strategy](#84-mocking-strategy)
  - [8.5 Testing Tools \& Configuration](#85-testing-tools--configuration)
  - [8.6 Continuous Integration](#86-continuous-integration)
  - [8.7 Edge Cases to Test](#87-edge-cases-to-test)
- [9. CI/CD and Release Management Requirements](#9-cicd-and-release-management-requirements)
  - [9.1 Continuous Integration Pipeline](#91-continuous-integration-pipeline)
    - [9.1.1 Pull Request Validation (`pr-validation.yml`)](#911-pull-request-validation-pr-validationyml)
    - [9.1.2 Security Scanning (`security.yml`)](#912-security-scanning-securityyml)
  - [9.2 Release Management with release-please](#92-release-management-with-release-please)
    - [9.2.1 Release Please Configuration](#921-release-please-configuration)
    - [9.2.2 Release Workflow (`release.yml`)](#922-release-workflow-releaseyml)
    - [9.2.3 Version Management](#923-version-management)
  - [9.3 Marketplace Publishing Requirements](#93-marketplace-publishing-requirements)
    - [9.3.1 Pre-Publish Checklist](#931-pre-publish-checklist)
    - [9.3.2 Publishing Process](#932-publishing-process)
    - [9.3.3 Rollback Procedure](#933-rollback-procedure)
  - [9.4 Branch Protection and Workflow](#94-branch-protection-and-workflow)
  - [9.5 Environment and Secrets Management](#95-environment-and-secrets-management)
  - [9.6 Monitoring and Notifications](#96-monitoring-and-notifications)
  - [9.7 Testing in CI/CD](#97-testing-in-cicd)
  - [9.8 Documentation in CI/CD](#98-documentation-in-cicd)

## About This Document

This document defines the **complete, aspirational requirements** for the MkDocs
Snippet Lens extension. It captures the end-state vision of the project, documenting
all features, capabilities, and constraints that should eventually be implemented.

**Purpose:**

- Define **what** the extension should do (features, behavior, constraints)
- Establish quality standards (performance, security, accessibility)
- Provide stable reference for design decisions and testing
- Serve as the single source of truth for "done" criteria

**What's Included:**

- Functional requirements (user-facing features)
- Non-functional requirements (performance, security, accessibility)
- Configuration settings and their defaults
- User stories and use cases
- Documentation requirements
- Technical specifications and constraints

**What's NOT Included:**

- Implementation details (see `IMPLEMENTATION.md`)
- Release schedules or phasing (see `IMPLEMENTATION.md`)
- Development tasks or milestones (see `IMPLEMENTATION.md`)
- Technical architecture decisions (those go in code comments/ADRs)

**Relationship to Other Documents:**

- `IMPLEMENTATION.md` - Breaks requirements into phased releases and defines **how**
  and **when** features will be built
- `RISKS.md` - Identifies risks and mitigation strategies for delivering these
  requirements
- `CHANGELOG.md` - Tracks which requirements have been implemented in each release

**Maintenance:**

- Update when requirements change or new needs are identified
- Requirements are relatively stable; changes should be deliberate
- All requirement changes should be reviewed for impact on existing implementation
- Version controlled with the codebase

---

## 1. Project Overview

**Name:** MkDocs Snippet Lens (or similar)

**Goal:** Enhance the VS Code editing experience for MkDocs users by detecting
snippet references (`--8<--`) and providing immediate access to the referenced
content without leaving the current file.

**License:** MIT License

### 1.1 Assumptions

This extension is built with the following assumptions about the target environment
and user base:

**User Knowledge and Behavior:**

- Users are familiar with MkDocs and its snippet syntax (`--8<--`)
- Users follow MkDocs snippet conventions as documented in the [MkDocs snippets
  documentation](https://facelessuser.github.io/pymdown-extensions/extensions/snippets/)
- Users have basic familiarity with VS Code features (command palette, settings,
  keyboard shortcuts)
- Users understand the difference between preview content (read-only) and actual file
  content
- Users want to preview snippet content inline as an alternative to opening files
  separately

**File System and Environment:**

- Workspace is on a local file system (not remote/SSH/Codespaces in initial version)
- Users have appropriate read permissions for snippet files within their workspace
- Snippet files are text-based and can be rendered as UTF-8 encoded text
- Markdown documentation files use standard `.md` file extension
- File paths in snippet references use forward slashes `/` or platform-appropriate
  separators
- Symbolic links, if used, point to files within the workspace boundary

**Project Structure:**

- Documentation projects are organized in VS Code workspaces or folders
- Snippet files are located within the workspace (or accessible via relative paths)
- File structure remains relatively stable (not rapidly changing during editing)
- Projects contain a reasonable number of snippet references (optimized for < 100 per
  file)

**Technical Environment:**

- VS Code version 1.85.0 or later is installed
- Node.js runtime is available (bundled with VS Code)
- Sufficient system resources for VS Code extension operation (see performance
  requirements)
- Platform is Windows 10+, macOS 11+, or Linux (Ubuntu 20.04+ equivalent)

**Privacy and Security:**

- Users prefer privacy and do not want telemetry/data collection
- Users work with trusted content within their own workspaces
- Path traversal protection is desired to prevent accidental access outside workspace
- Users accept that previews are local-only and require no network access

**Development and Maintenance:**

- The extension will be actively maintained for bug fixes and security updates
- Breaking changes will follow semantic versioning (major version bumps)
- Community feedback will guide feature prioritization post-v1.0
- MkDocs snippet syntax remains stable or changes are backwards-compatible

**Out of Scope Assumptions:**

The following are explicitly NOT assumed and represent potential future enhancements:

- Multi-root workspace support (limited support initially)
- Remote workspace support (SSH, Codespaces, WSL)
- Real-time collaborative editing scenarios
- Snippet files in binary formats or requiring special rendering
- Non-standard markdown file extensions (only `.md` initially)
- Integration with MkDocs build process or preview server

## 2. Functional Requirements

### 2.1 Snippet Detection

- **Pattern Matching:** The extension must actively scan open Markdown (`.md`) files
  for the standard MkDocs snippet syntax:
  - Syntax variations:
    - `--8<-- "path/to/file.ext"` - entire file
    - `--8<-- "path/to/file.ext:name"` - named section
    - `--8<-- "path/to/file.ext:start:end"` - line numbers
  - **Examples:**

    ```markdown
    <!-- Include entire file -->
    --8<-- "src/hello.py"
    --8<-- 'ch07/counter/counter.go'

    <!-- Include named section -->
    --8<-- "src/example.py:func"
    --8<-- "config.yaml:database-config"

    <!-- Include specific line ranges -->
    --8<-- "main.py:10:20"
    --8<-- "utils.js:5"
    --8<-- "readme.md::15"
    --8<-- "test.py:1:3,5:6"
    ```

  - **Named Section Markers:**
    - Defined in source files as `--8<-- [start:name]` and `--8<-- [end:name]`
    - Section name can contain letters, numbers, hyphens, and underscores
    - Markers can be embedded in comments (e.g., `# --8<-- [start:func]` in Python)
    - Both start and end markers are required and matched by name
    - The lines containing the markers themselves are excluded from the snippet
  - **Line Number Ranges:**
    - `file.ext:5` - from line 5 to end of file
    - `file.ext::10` - from line 1 to line 10
    - `file.ext:5:10` - from line 5 to line 10 (inclusive)
    - `file.ext:1:3,5:6` - multiple ranges (lines 1-3 and 5-6)
    - Negative indexes supported (e.g., `file.ext:-5` for last 5 lines)
    - Line numbers are 1-based (0 is clamped to 1)
  - Must support both single quotes `'` and double quotes `"`.
  - Must handle relative paths (relative to the current file or a configured base).
- **Trigger Events:** Detection should occur:
  - On file open.
  - On file save.
  - (Optional) Debounced while typing (for immediate feedback).

### 2.2 Feature: Open Referenced File

- **Interaction:** Users must be able to click the file path within the snippet
  syntax to open it.
- **Implementation:** Utilize the **Document Link Provider** API.
  - The file path string (e.g., `"ch07/counter/counter.go"`) becomes a clickable
    link.
  - **Behavior:** Clicking opens the file in a new editor tab.

### 2.3 Feature: Content Preview ("Ghost Text")

- **Visual Indicator:** Display the contents of the referenced file directly below
  the snippet line.
- **Style:** The text should appear as "ghost text" (faded/greyed out) to distinguish
  it from the actual source code of the markdown file.
- **Toggle Mechanisms:** Since snippet files can be large, previews should be
  toggleable rather than always on.
  - **Per-Snippet Toggle (CodeLens):** A clickable action above the line (e.g.,
    `$(eye) Show Snippet Content`) to toggle visibility of individual snippet
    previews.
  - **Per-Snippet Toggle (Keyboard):** Command "MkDocs Snippet Lens: Toggle Preview
    for Current Line" to toggle the preview for the snippet at the current cursor
    position.
  - **Global Toggle (Keyboard):** Command "MkDocs Snippet Lens: Toggle All Previews"
    with keyboard shortcut (e.g., `Ctrl+K Ctrl+S` / `Cmd+K Cmd+S`) to show/hide all
    snippet previews in the current document at once.
- **State Management:**
  - Per-snippet toggle states should persist during the editing session.
  - Global toggle state should be remembered per-document or per-workspace based on
    the `mkdocsLens.defaultPreviewState` setting.
  - When global toggle is used, it should override individual per-snippet states.
- **Recursive Snippet Processing:** The preview must process nested snippet
  references the same way MkDocs does:
  - If a referenced file contains `--8<--` directives, those should be expanded
    recursively in the preview.
  - Maximum recursion depth of 100 levels to match MkDocs behavior.
- **Snippet Sections:** Support MkDocs snippet section syntax for partial file
  inclusion:
  - **Named Sections:** `--8<-- "file.ext:section_name"`
    - Sections are defined in source files using `--8<-- [start:name]` and `--8<--
      [end:name]`
    - Only the content between the markers is included (marker lines are excluded)
    - Section names are matched exactly
  - **Line Number Ranges:** `--8<-- "file.ext:start:end"`
    - Support single line to end: `file.ext:5`
    - Support start to line: `file.ext::10`
    - Support specific range: `file.ext:5:10`
    - Support multiple ranges: `file.ext:1:3,5:6`
    - Support negative indexes: `file.ext:-5` (last 5 lines)
    - Line numbers are 1-based
- **Circular Reference Handling:** If a circular reference is detected (file A
  includes file B which includes file A):
  - Stop processing at the point where the cycle is detected.
  - Display an error message in the preview indicating "Circular snippet reference
    detected" at the point where the cycle would occur.
  - This matches MkDocs behavior which prevents infinite loops.
- **Auto-Refresh on File Changes:** Preview content must automatically update when
  snippet files are modified:
  - Use VS Code's file watcher API (`workspace.createFileSystemWatcher`) to monitor
    referenced snippet files.
  - When a snippet file changes, invalidate the cache and re-render all previews that
    reference it (directly or through nested snippets).
  - Update should occur within 500ms of the file change being detected.
  - Handle the dependency chain: if file A includes file B includes file C, changes
    to C should refresh previews in both B and A.
  - Debounce rapid changes (same file modified multiple times in quick succession) to
    avoid excessive re-rendering.

### 2.4 Feature: Hover Tooltips

Provide hover tooltips as an accessible alternative to ghost text decorations.

**Hover Provider Requirements:**

- **Trigger:** When user hovers over snippet reference (the entire `--8<--` line)
- **Content:** Display snippet content in hover tooltip
- **Formatting:**
  - Show file path as header (clickable link to open file)
  - Display snippet content with syntax highlighting matching file type
  - Show line count: "(showing X of Y lines)" if truncated
  - Respect `mkdocsLens.previewLines` setting for tooltip length
  - Indicate errors with message: "Cannot preview: [error message]"
- **Behavior:**
  - Load content on-demand (don't preload for all snippets)
  - Cache tooltip content using same cache as ghost text
  - Show loading indicator for slow operations (> 100ms)
  - Timeout after 2 seconds, show error message if content not loaded

**Accessibility:**

- Screen readers can access tooltip content via keyboard navigation
- Tooltip provides full snippet information even when ghost text is hidden
- Essential for users who disable ghost text decorations

**Example Tooltip Structure:**

```text
📄 src/example.py (click to open)
─────────────────────────────
def hello():
    print("Hello, world!")

(showing 3 of 50 lines)
```

**Error Tooltip Structure:**

```text
📄 src/missing.py
─────────────────────────────
⚠️ Cannot preview: Snippet file not found
```

### 2.5 Feature: Error Handling

All error conditions should prevent ghost text preview rendering and mark the file
path with a red squiggly underline (diagnostic error). Error messages must include
file and line number information, with full chain context for recursive snippets. All
error messages must be i18n-ready (see Section 4.5 for detailed requirements).

#### 2.5.1 Missing Files

- **Visual Indicator:** Red squiggly underline on the file path.
- **Error Message:**
  - Format: "Snippet file not found: 'referenced_file' (in file.md:10)"
  - For recursive snippets: "Snippet file not found: 'referenced_file' (in
    parent_file.md:15 via root_file.md:5)"

#### 2.4.2 Invalid Path Syntax

- **Condition:** File path contains invalid characters or malformed path components.
- **Visual Indicator:** Red squiggly underline on the file path.
- **Error Message:**
  - Format: "Invalid file path syntax (in file.md:10)"
  - For recursive snippets: Include the full chain: "Invalid file path syntax (in
    parent_file.md:15 via root_file.md:5)"

#### 2.4.3 Permission Denied

- **Condition:** File exists but cannot be read due to permission issues.
- **Visual Indicator:** Red squiggly underline on the file path.
- **Error Message:**
  - Format: "Permission denied: cannot read snippet file 'referenced_file' (in
    file.md:10)"
  - For recursive snippets: Include the full chain.

#### 2.4.4 Invalid Section Specification

- **Condition:** Snippet section markers are specified but not found in the
  referenced file, OR line numbers are out of range.
- **Visual Indicator:** Red squiggly underline on the file path.
- **Error Message:**
  - For named sections: "Section markers not found in 'referenced_file': section
    'name' (in file.md:10)"
  - For line numbers: "Line range out of bounds in 'referenced_file': lines X:Y
    exceed file length N (in file.md:10)"
  - Include actual marker names/line numbers and file/line information.
  - For recursive snippets: Include the full chain.
- **Note:** If a named section's start or end marker is missing, treat as an error
  since both are required for a valid section.

#### 2.4.5 Unsaved File with Relative Paths

- **Condition:** Markdown file is unsaved (untitled) and contains relative snippet
  paths.
- **Visual Indicator:** Yellow squiggly underline (warning) on the file path.
- **Warning Message:**
  - Format: "Relative snippet paths in unsaved files resolve relative to workspace
    root. Save the file for accurate path resolution (in {filename})"
  - Where {filename} is the untitled filename (e.g., "Untitled-1")
- **Behavior:**
  - This is a warning, not an error - snippets may still work if resolvable from
    workspace root
  - If path cannot be resolved even from workspace root, show error diagnostic
    instead (2.4.1)

### 2.5 Feature: Command Palette Commands

The extension must provide user-accessible commands through the VS Code Command
Palette for controlling preview behavior and navigating snippets.

**Command Naming Convention:**

- All commands must use the `mkdocsLens` prefix
- All commands must include the category "MkDocs Snippet Lens" for grouping in the
  Command Palette
- Command titles must be descriptive and action-oriented

#### 2.5.1 Preview Control Commands

##### Toggle All Previews

- **Command ID:** `mkdocsLens.toggleAllPreviews`
- **Title:** "MkDocs Snippet Lens: Toggle All Previews"
- **Purpose:** Show or hide all snippet previews in the current document
- **Availability:** Active when a Markdown file is open
- **Suggested Keybinding:** `Ctrl+Alt+P` (Windows/Linux), `Cmd+Alt+P` (macOS)
- **Default Keybinding:** None (users can configure)

##### Show All Previews

- **Command ID:** `mkdocsLens.showAllPreviews`
- **Title:** "MkDocs Snippet Lens: Show All Previews"
- **Purpose:** Explicitly show all snippet previews (clearer than toggle when state
  is unknown)
- **Availability:** Active when a Markdown file is open

##### Hide All Previews

- **Command ID:** `mkdocsLens.hideAllPreviews`
- **Title:** "MkDocs Snippet Lens: Hide All Previews"
- **Purpose:** Explicitly hide all snippet previews
- **Availability:** Active when a Markdown file is open

##### Toggle Current Preview

- **Command ID:** `mkdocsLens.toggleCurrentPreview`
- **Title:** "MkDocs Snippet Lens: Toggle Preview at Cursor"
- **Purpose:** Toggle preview for the snippet at current cursor position
- **Availability:** Active when cursor is on a snippet line in a Markdown file
- **Suggested Keybinding:** `Ctrl+Alt+T` (Windows/Linux), `Cmd+Alt+T` (macOS)
- **When Clause:** `editorLangId == markdown && mkdocsLens:hasSnippetAtCursor`

##### Refresh All Previews

- **Command ID:** `mkdocsLens.refreshAllPreviews`
- **Title:** "MkDocs Snippet Lens: Refresh All Previews"
- **Purpose:** Manually reload all snippet content (useful if auto-refresh fails or
  is disabled)
- **Availability:** Active when a Markdown file is open with snippets

##### Refresh Current Preview

- **Command ID:** `mkdocsLens.refreshCurrentPreview`
- **Title:** "MkDocs Snippet Lens: Refresh Preview at Cursor"
- **Purpose:** Refresh only the snippet at cursor position
- **Availability:** Active when cursor is on a snippet line
- **When Clause:** `editorLangId == markdown && mkdocsLens:hasSnippetAtCursor`

#### 2.5.2 Navigation Commands

##### Go to Next Snippet

- **Command ID:** `mkdocsLens.goToNextSnippet`
- **Title:** "MkDocs Snippet Lens: Go to Next Snippet"
- **Purpose:** Move cursor to the next snippet reference in the current document
- **Availability:** Active when a Markdown file is open with snippets
- **Suggested Keybinding:** `F8` (matches "Go to Next Problem" convention)

##### Go to Previous Snippet

- **Command ID:** `mkdocsLens.goToPreviousSnippet`
- **Title:** "MkDocs Snippet Lens: Go to Previous Snippet"
- **Purpose:** Move cursor to the previous snippet reference in the current document
- **Availability:** Active when a Markdown file is open with snippets
- **Suggested Keybinding:** `Shift+F8` (matches "Go to Previous Problem" convention)

#### 2.5.3 Accessibility & Utility Commands

##### Copy Snippet Content

- **Command ID:** `mkdocsLens.copySnippetContent`
- **Title:** "MkDocs Snippet Lens: Copy Snippet Content to Clipboard"
- **Purpose:** Copy the expanded snippet content at cursor to clipboard
- **Availability:** Active when cursor is on a snippet line
- **Accessibility Note:** Essential for screen reader users who cannot see ghost text

##### Open Snippet File to Side

- **Command ID:** `mkdocsLens.openSnippetBeside`
- **Title:** "MkDocs Snippet Lens: Open Snippet File to the Side"
- **Purpose:** Open snippet file in split editor for side-by-side editing
- **Availability:** Active when cursor is on a snippet line

##### Clear Cache

- **Command ID:** `mkdocsLens.clearCache`
- **Title:** "MkDocs Snippet Lens: Clear Cache"
- **Purpose:** Manually clear all cached snippet content
- **Availability:** Always available (for troubleshooting)

##### Show Output Channel

- **Command ID:** `mkdocsLens.showOutputChannel`
- **Title:** "MkDocs Snippet Lens: Show Output Channel"
- **Purpose:** Open the extension's output channel to view logs
- **Availability:** Always available (for debugging)

#### 2.5.4 Context Keys

To support conditional command availability, the extension must set the following
context keys:

- `mkdocsLens:hasSnippetAtCursor` - Boolean, true when cursor is on a line containing
  a snippet reference
- `mkdocsLens:hasSnippets` - Boolean, true when the current document contains any
  snippet references
- `mkdocsLens:previewsVisible` - Boolean, true when any previews are currently
  visible

**Implementation Notes:**

- Context keys must be updated when document changes or cursor moves
- Use `vscode.commands.executeCommand('setContext', key, value)` to update
- Debounce cursor position updates to avoid performance issues

#### 2.5.5 Keybinding Strategy

**Default Keybindings:**

- No default keybindings should be set initially to avoid conflicts with other
  extensions
- Document **suggested** keybindings in README for users to configure
- After v1.0, consider adding default keybindings for most-used commands based on
  user feedback

**Keybinding Configuration (if defaults are added):**

```json
{
  "key": "ctrl+alt+p",
  "mac": "cmd+alt+p",
  "command": "mkdocsLens.toggleAllPreviews",
  "when": "editorLangId == markdown"
}
```

**Requirements:**

- All keybindings must respect the `when` clause to only activate in appropriate
  contexts
- Mac-specific keybindings must use `Cmd` instead of `Ctrl`
- Must not override common VS Code or popular extension keybindings

#### 2.5.6 Command Implementation Requirements

**Registration:**

- All commands must be registered in the `activate()` function
- Commands must be added to `context.subscriptions` for proper disposal
- Command IDs in code must match IDs in `package.json` `contributes.commands`

**Error Handling:**

- Commands must not throw unhandled errors
- Show user-friendly error messages via `window.showErrorMessage()` if operation
  fails
- Log detailed errors to output channel for troubleshooting

**Feedback:**

- Commands that modify state should provide visual feedback (status bar message,
  etc.)
- Long-running commands should show progress indicators
- Commands should complete quickly (< 200ms perceived response time)

**Accessibility:**

- All commands must be keyboard accessible
- Command titles must be descriptive and screen-reader friendly
- Avoid icons-only in command labels

## 3. Configuration Settings

- `mkdocsLens.basePath`: (String) The root directory to resolve snippet paths
  against.
  - *Default:* `${workspaceFolder}`
  - *Option:* `${fileDirname}` (relative to the current markdown file).

- `mkdocsLens.previewLines`: (Number) Limit the number of lines shown in the ghost
  text preview to prevent massive files from cluttering the view (e.g., default to 20
  lines).

- `mkdocsLens.defaultPreviewState`: (String) Control the default state of snippet
  previews when opening a file.
  - *Options:* `"on"`, `"off"`, `"remember"`
  - *Default:* `"off"`
  - `"on"`: All previews are shown by default
  - `"off"`: All previews are hidden by default
  - `"remember"`: Remember the last global toggle state per-document or per-workspace

- `mkdocsLens.maxFileSize`: (Number) Maximum file size in bytes for snippet previews.
  - *Default:* `1048576` (1MB)
  - Files exceeding this limit will show a truncation warning instead of content

- `mkdocsLens.maxPreviewCount`: (Number) Maximum number of visible previews at once.
  - *Default:* `50`
  - Prevents performance degradation with many snippets in a single file

- `mkdocsLens.debounceDelay`: (Number) Milliseconds to wait before updating previews
  while typing.
  - *Default:* `300`
  - Range: 100-1000ms

- `mkdocsLens.enablePathTraversalProtection`: (Boolean) Prevent snippet paths from
  accessing files outside the workspace.
  - *Default:* `true`
  - When enabled, paths like `../../etc/passwd` will be rejected with an error

- `mkdocsLens.followSymlinks`: (Boolean) Follow symbolic links when resolving snippet
  paths.
  - *Default:* `true`
  - When `false`, symlinks are treated as errors
  - Useful for high-security environments where symlinks are not expected

### 3.1 Configuration Validation

All configuration settings must be validated to prevent extension errors and provide
clear feedback to users.

**Validation Rules:**

- **`mkdocsLens.basePath`:**
  - Must be a valid string containing a path or VS Code variable
  - Supported variables: `${workspaceFolder}`, `${fileDirname}`
  - If path doesn't exist or is inaccessible, show warning notification and fall back
    to `${workspaceFolder}`
  - Empty string or null values default to `${workspaceFolder}`

- **`mkdocsLens.previewLines`:**
  - Must be a positive integer between 1 and 1000
  - Invalid values (negative, zero, non-numeric, > 1000) default to 20
  - Show warning in output channel for invalid values

- **`mkdocsLens.defaultPreviewState`:**
  - Must be one of: `"on"`, `"off"`, `"remember"`
  - Invalid values default to `"off"`
  - Show warning in output channel for invalid values

- **`mkdocsLens.maxFileSize`:**
  - Must be a positive integer (bytes)
  - Minimum: 1024 (1KB), Maximum: 10485760 (10MB)
  - Invalid values default to 1048576 (1MB)
  - Show warning in output channel for invalid values

- **`mkdocsLens.maxPreviewCount`:**
  - Must be a positive integer between 1 and 500
  - Invalid values default to 50
  - Show warning in output channel for invalid values

- **`mkdocsLens.debounceDelay`:**
  - Must be an integer between 100 and 1000 (milliseconds)
  - Invalid values default to 300
  - Show warning in output channel for invalid values

- **Boolean Settings:**
  - `mkdocsLens.enablePathTraversalProtection`
  - `mkdocsLens.followSymlinks`
  - Non-boolean values default to documented default value
  - Show warning in output channel for invalid values

**Configuration Change Handling:**

- **Immediate Effect:** Changes to boolean flags and numeric limits take effect
  immediately
- **Requires Reprocessing:** Changes to `basePath` trigger re-processing of all open
  markdown files
- **User Notification:** Changes affecting active previews show status bar message:
  "MkDocs Snippet Lens: Configuration updated"
- **Error Recovery:** Invalid configuration never crashes extension; always falls
  back to safe defaults

**Validation Timing:**

- Validate on extension activation
- Validate when configuration changes (`workspace.onDidChangeConfiguration`)
- Validate before each use (defensive programming for runtime type changes)

## 4. Non-Functional Requirements

### 4.1 Platform & Environment

- **Minimum VS Code Version:** 1.85.0 (November 2023)
  - Rationale: Requires stable Text Decorations API and modern TypeScript support

- **Supported Platforms:**
  - Windows 10/11
  - macOS 11.0 (Big Sur) or later
  - Linux (Ubuntu 20.04+ or equivalent)

- **Maximum Workspace Size:** No hard limit, but performance optimized for:
  - Up to 10,000 markdown files
  - Individual files up to 10MB (though snippet preview limited to 1MB)
  - Up to 100 concurrent snippet references per file

### 4.2 Security Requirements

- **Path Traversal Protection:**
  - **Objective:** Prevent snippet paths from accessing files outside the workspace
    while allowing legitimate cross-folder references within the workspace (e.g.,
    docs referencing source code in `src/`).
  - **Allowed Paths:**
    - Any absolute or relative path that resolves to a file within the workspace
      folder
    - Paths are resolved using `workspace.getWorkspaceFolder()` to determine the
      workspace boundary
    - Symbolic links are resolved (see Symlink Handling below), and the final
      resolved path must be within the workspace
  - **Blocked Paths:**
    - Any path that resolves outside the workspace folder (e.g.,
      `../../../etc/passwd`)
    - Paths containing null bytes or other filesystem attack vectors
    - When `mkdocsLens.enablePathTraversalProtection` is `true` (default), external
      paths are blocked with an error
    - When `mkdocsLens.enablePathTraversalProtection` is `false`, external paths are
      allowed but show a warning diagnostic
  - **Error Handling:**
    - Display diagnostic error: "Snippet path resolves outside workspace:
      '/resolved/absolute/path' (in file.md:10)"
    - Red squiggly underline on the file path
    - For recursive snippets, include the full chain context
  - **Logging:**
    - Log all blocked path attempts to the extension's output channel
    - Include the original path, resolved path, and workspace root for debugging
    - Format: `[Security] Blocked path outside workspace: 'original/path' resolved to
      '/absolute/path' (workspace: '/workspace/root')`

- **Symlink Handling:**
  - **Strategy:** Resolve symlinks with strict security validation to support
    legitimate development workflows while preventing security exploits.
  - **Resolution Process:**
    - Use Node's `fs.realpath()` or VS Code's equivalent to resolve symlinks to their
      final target
    - Resolves the entire path, including intermediate symlinks
    - Final resolved path must point to an actual file (not another symlink)
  - **Security Validation:**
    - After resolution, check that the final absolute path is within the workspace
      boundary
    - Use normalized, absolute paths for comparison (handles `.`, `..`, case
      sensitivity)
    - If resolved path is outside workspace and
      `mkdocsLens.enablePathTraversalProtection` is `true`, block with error
    - If protection is `false`, allow but show warning diagnostic
  - **Attack Prevention:**
    - **Loop detection:** Detect circular symlinks (A → B → A) and fail with error
    - **Depth limit:** Maximum 40 symlink resolution levels (matches Linux kernel
      limit)
    - **Race condition protection:** Validate path existence and permissions after
      resolution
  - **Platform Considerations:**
    - **Windows:** Also handle junction points and directory symlinks using same
      logic
    - **macOS/Linux:** Handle both file and directory symlinks
    - **All platforms:** Hard links are transparent (appear as regular files), no
      special handling needed
  - **Error Messages:**
    - Circular symlink: "Symlink loop detected in snippet path '{path}' (in
      file.md:10)"
    - Depth exceeded: "Symlink resolution depth exceeded for '{path}' (in
      file.md:10)"
    - Outside workspace: "Snippet path resolves outside workspace via symlink:
      '{original}' → '{resolved}' (in file.md:10)"
    - Broken symlink: "Snippet file not found: '{path}' (in file.md:10)" (same as
      missing file)
    - Dangling symlink: "Cannot resolve symlink in '{path}' (in file.md:10)"
  - **Logging:**
    - Log all symlink resolutions to output channel (debug level)
    - Format: `[Path Resolution] Symlink resolved: 'original/path' →
      '/absolute/resolved/path'`
    - Format for blocked: `[Security] Blocked symlink outside workspace:
      'original/path' → '/resolved/path' (workspace: '/workspace/root')`
  - **Optional Configuration:**
    - Setting: `mkdocsLens.followSymlinks` (boolean, default `true`)
    - When `false`, treat symlinks as errors instead of following them
    - Useful for high-security environments where symlinks are not expected

- **File Size Limits:**
  - Prevent DOS attacks from extremely large snippet files
  - Default 1MB limit for previews (configurable via `mkdocsLens.maxFileSize`)
  - Display warning message for files exceeding limit instead of loading content
  - Enforce timeout on file read operations (5 seconds max)

- **Resource Consumption:**
  - Limit maximum concurrent file I/O operations to 10
  - Implement cancellation tokens for all async operations
  - Release resources immediately when editors are closed
  - Prevent unbounded memory growth through proper cache invalidation

- **Privilege Model:**
  - Extension requires only file system read access
  - No write access to any files
  - No network access required (all operations are local)

- **Privacy and Telemetry:**
  - **No telemetry or analytics collection** - The extension collects no usage data
  - **No network requests** - All operations are performed locally within the
    workspace
  - **No user tracking** - No identifiers, metrics, or behavioral data collected
  - **No external services** - Extension does not communicate with any external
    servers
  - **Privacy guarantee** - User data never leaves the local machine
  - **Rationale:** Builds user trust, simplifies compliance (GDPR), reduces
    maintenance burden
  - **Note:** Extension updates are handled by VS Code Marketplace (standard for all
    extensions)

### 4.3 Reliability Requirements

- **Error Recovery:**
  - Extension must not crash VS Code under any error condition
  - Gracefully handle and log unexpected errors
  - Provide clear error messages to users without exposing sensitive paths

- **Data Integrity:**
  - Read-only access ensures no accidental file modifications
  - Preview decorations never modify the actual markdown content
  - State persistence uses VS Code's storage APIs only

### 4.4 Internationalization (i18n)

- **Message Externalization:**
  - All user-facing strings must be externalized for translation
  - Use VS Code's `vscode-nls` package for message localization
  - Error messages, status messages, command labels, and setting descriptions must be
    localizable
  - No hardcoded user-facing strings in code

- **Message Keys:**
  - Use descriptive message keys (e.g., `error.snippetNotFound` instead of `err1`)
  - Organize keys by feature/component for maintainability
  - Include context comments for translators in message bundle files

- **String Formatting:**
  - Use parameterized messages for dynamic content (file names, line numbers, etc.)
  - Example: `"Snippet file not found: '{0}' (in {1}:{2})"` where `{0}` = filename,
    `{1}` = source file, `{2}` = line number
  - Avoid string concatenation that assumes English grammar/word order
  - Support plural forms where applicable

- **Initial Language Support:**
  - English (en) as the default/base language
  - Additional languages are out of scope for initial version but infrastructure must
    support future additions
  - All strings in `package.nls.json` for easy extraction

- **i18n Best Practices:**
  - Avoid assumptions about text direction (LTR/RTL)
  - Don't hardcode punctuation in concatenated strings
  - Keep messages concise but informative
  - Use complete sentences rather than fragments for better translation context

- **Testing:**
  - Verify all user-facing strings use localization functions
  - Test with pseudo-localization to ensure UI accommodates longer strings
  - Ensure no text is truncated when using different languages

### 4.5 Memory Usage Limits

- **Maximum Memory Footprint:**
  - Target: < 50MB for typical usage (10-20 open files with snippets)
  - Ceiling: < 200MB even with maximum configured limits

- **Cache Management:**
  - Cache snippet content with LRU eviction policy
  - Maximum cache size: 100 entries or 10MB, whichever is smaller
  - Invalidate cache entries when source files change
  - Clear all caches when workspace folder changes

- **Decoration Limits:**
  - Dispose decorations immediately when toggled off
  - Limit decoration content to configured `mkdocsLens.previewLines`
  - Reuse decoration types instead of creating new ones per line

## 5. Technical Specifications & Constraints

### 5.1 "Ghost Text" Implementation Strategy

- *Note on Feasibility:* VS Code does not support inserting actual read-only text
  "blocks" between lines easily.
- **Recommended Solution:** Use **Text Decorations**
  (`window.createTextEditorDecorationType`).
  - We can apply a decoration to the snippet line that adds an `after` property.
  - The `contentText` of the `after` property can contain newlines (`\n`),
    effectively rendering a block of text below the line.

#### 5.1.1 Ghost Text Styling

Use theme-aware colors that adapt to the user's color theme:

- **Color Options (in order of preference):**
  1. `editorGhostText.foreground` - Designed specifically for inline suggestions
  2. `editorCodeLens.foreground` - Used for CodeLens (typically faded)
  3. `descriptionForeground` - Used for secondary/descriptive text
  4. `editor.foreground` with opacity 0.4-0.6

- **Font Style:** Use `italic` to distinguish ghost text from actual markdown content

- **Opacity:** 40-60% (0.4-0.6) works well across most themes if using opacity-based
  approach

- **Optional Enhancements:**
  - Font size: Slightly smaller (0.9-0.95em) for subtle distinction
  - Border: Subtle left border (2px) using theme color to visually separate from
    markdown
  - Margin: Small left margin (1em) for indentation

- **Example Implementation:**

  ```typescript
  const ghostTextDecoration = window.createTextEditorDecorationType({
    after: {
      color: new vscode.ThemeColor('editorCodeLens.foreground'),
      fontStyle: 'italic',
      textDecoration: 'none; font-size: 0.95em;',
      borderLeft: '2px solid',
      borderColor: new vscode.ThemeColor('editorCodeLens.foreground'),
      margin: '0 0 0 1em'
    }
  });
  ```

- **Avoid:**
  - Hardcoded colors (e.g., `#808080`) - won't work with all themes
  - Too low opacity (< 30%) - difficult to read
  - Too high opacity (> 70%) - confuses with actual code

#### 5.1.2 Decoration Interaction with Other Extensions

VS Code's decoration API composites multiple decorations without conflicts. This
extension's ghost text won't interfere with other extensions.

- **No special handling needed:** After-decorations don't modify actual text, just
  add visual content below the line.
- **Visual clutter mitigation:** Keep decorations subtle (faded, italic) and respect
  configured `previewLines` limit.
- **User control:** Toggle functionality allows users to hide previews if
  experiencing visual overload.
- **Expected compatibility:**
  - Linters (ESLint, Markdownlint) - use different decoration ranges
  - Git decorations - appear in gutter, not inline
  - Other preview extensions - typically use hovers or separate panels
- **Edge case:** Multiple extensions adding after-line decorations to the same line
  will stack vertically (expected VS Code behavior).

### 5.2 Path Resolution Logic

1. Check if the path is absolute.
2. If relative, attempt to resolve relative to the **current file**.
3. If not found, attempt to resolve relative to the **workspace root** (or configured
    `basePath`).

#### 5.2.1 Untitled/Unsaved File Handling

Untitled files (e.g., `Untitled-1`) don't have a file path on disk, which affects
relative path resolution.

- **Detection:** Check if `document.uri.scheme === 'untitled'`
- **Path resolution for untitled files:**
  - **Absolute paths:** Process normally - these work regardless of current file
    location
  - **Relative paths:**
    - Skip "relative to current file" resolution step (no current file path exists)
    - Only attempt resolution relative to workspace root / configured `basePath`
    - If no workspace folder is available, show diagnostic error
- **User feedback:**
  - Show **warning diagnostic** (yellow squiggle) on snippets with relative paths in
    untitled files
  - Message: "Relative snippet paths in unsaved files resolve relative to workspace
    root. Save the file for accurate path resolution (in {filename})"
  - This informs users but doesn't block functionality
- **Documentation:**
  - README should note: "For best results with relative snippet paths, save your
    markdown file first"
  - Include in hover tooltip for the warning

### 5.3 Multi-Root Workspace Support

**Scope:** Multi-root workspace support is **out of scope** for the initial version
of this extension.

**Behavior:**

- The extension will work with the workspace folder containing the current markdown
  document.
- Use `workspace.getWorkspaceFolder(documentUri)` to determine the workspace folder
  for path resolution.
- Each workspace folder will be treated independently (no cross-folder snippet
  references).

**Future Enhancement:**

- Full multi-root workspace support, including cross-folder references and
  folder-specific configuration, is planned for a future version.
- This approach ensures the extension works correctly in multi-root workspaces while
  deferring advanced features.

### 5.4 Performance Requirements

- **Responsiveness:**
  - Extension operations must not block typing or UI interactions.
  - Target: < 50ms for synchronous operations, < 200ms for user-perceived actions.

- **File Size Limits:**
  - Set maximum file size for snippet previews (default: 1MB).
  - Display warning or truncate content for files exceeding the limit.
  - Prevent memory issues from loading extremely large files.

- **Debouncing:**
  - If detecting snippets while typing, debounce updates (300-500ms).
  - Only process the active editor, not all open files simultaneously.

- **Async Operations:**
  - All file I/O operations must be asynchronous (use `workspace.fs.readFile`).
  - Use cancellation tokens for long-running operations.
  - Allow users to continue working while previews load in the background.

- **Resource Management:**
  - Limit concurrent snippet previews (e.g., max 50 visible previews at once).
  - Dispose decorations when editors are closed to prevent memory leaks.
  - Clear caches periodically with appropriate invalidation strategy.

- **Activation Time:**
  - Extension should activate in < 500ms.
  - Use specific activation events (`onLanguage:markdown`) rather than `*`.
  - Lazy-load features only when needed.

- **Incremental Updates:**
  - Only re-process changed portions of the document.
  - Cache resolved file paths and content with proper invalidation.
  - Update decorations incrementally, not all at once.

### 5.4.1 Performance Degradation and Graceful Failure

Define specific behaviors when system limits are approached or exceeded.

**When Snippet Count Exceeds Limits:**

- **Configured Limit (`mkdocsLens.maxPreviewCount`):**
  - Show warning diagnostic on first snippet beyond limit
  - Message: "Preview limit reached (X/Y). Increase mkdocsLens.maxPreviewCount or
    toggle off some previews."
  - Disable CodeLens "Show" action for snippets beyond limit
  - Show limit status in hover tooltip
  - Still allow clicking links to open files

- **Hard Limit (500 snippets per file):**
  - Show error notification once per file
  - Message: "Too many snippets in this file (X found). Only first 500 will be
    processed."
  - Log warning to output channel
  - Disable preview features but maintain document link functionality

**When File Size Exceeds Limits:**

- **Preview warning (> 100KB):**
  - Show truncation indicator in preview: "... (content truncated, file is X KB)"
  - Display full size in hover tooltip with warning icon
  - Offer "Open in Editor" button in CodeLens

- **Preview disabled (> maxFileSize):**
  - Show diagnostic warning on snippet line
  - Message: "Preview disabled: file exceeds size limit (X MB > Y MB)"
  - Hover tooltip shows file info and limit
  - Link still works to open file

**File Watcher Resource Limits:**

- **OS Limit Approached:**
  - Detect when approaching platform limits (e.g., Linux inotify limit)
  - Show warning notification: "File watcher limit reached. Auto-refresh disabled for
    some files."
  - Log affected files to output channel
  - Prioritize watching files in active editor

- **Watcher Creation Fails:**
  - Silently disable auto-refresh for that file
  - Log error to output channel
  - Manual refresh still works via command

**Large Workspace Handling:**

- **Workspace Size Check:**
  - Count markdown files on first activation
  - If > 10,000 files, show info notification: "Large workspace detected. Some
    features may be slower."
  - Increase debounce delays automatically (+100ms)
  - Limit concurrent processing to 5 files

**System Under Load:**

- **CPU/Memory Pressure:**
  - Detect slow operations (> 2x normal time)
  - Increase debounce delays dynamically
  - Reduce cache size temporarily
  - Log performance degradation to output channel

**Network File Systems:**

- **Slow I/O Detection:**
  - Timeout file reads after 5 seconds
  - Show warning: "Snippet file load timeout (network drive?)"
  - Suggest increasing `maxFileSize` or using local files
  - Cache aggressively to reduce repeated reads

**Recovery Actions:**

- All degraded states automatically recover when conditions improve
- User can manually trigger "Clear Cache and Refresh" command to reset
- Extension never crashes; falls back to basic functionality (links only)

### 5.5 Extension Activation

**Activation Event:** `onLanguage:markdown`

**Rationale:**

- Extension only provides value for Markdown files
- Enables lazy loading - only activates when user opens a `.md` file
- Standard pattern for language-specific extensions
- Good performance - doesn't activate unnecessarily on workspace open

**Configuration in package.json:**

```json
{
  "activationEvents": [
    "onLanguage:markdown"
  ]
}
```

**Behavior:**

- Extension activates when user opens any Markdown (`.md`) file
- Remains dormant if no Markdown files are opened
- All providers (DocumentLink, CodeLens, Diagnostics, Decorations) require extension
  to be active
- Commands are automatically available via `onCommand` activation (inferred from
  `contributes.commands` in package.json)

**Performance Target:**

- Activation time: < 500ms (measured from activation event to ready state)
- No blocking operations during activation
- Lazy initialization of heavy components (cache, file watchers) until first use

**What NOT to use:**

- `"*"` (activate on startup) - Wasteful, extension provides no value without
  markdown files
- `"onStartupFinished"` - Delays functionality unnecessarily
- `"workspaceContains:**/*.md"` - Activates too early on workspace load

**Testing Requirements:**

- Verify extension doesn't activate on workspace open without markdown files
- Verify extension activates when first markdown file is opened
- Verify activation time is within 500ms budget
- Test command availability before and after activation
- Measure memory footprint after activation

### 5.5.1 Extension Lifecycle and Resource Management

Define requirements for extension activation, deactivation, and resource cleanup.

**Activation (`activate()` function):**

- **Registration:**
  - Register all providers (DocumentLink, CodeLens, Diagnostics, Decorations)
  - Register all commands
  - Add all disposables to `context.subscriptions` array for automatic cleanup
  - Initialize output channel and add to subscriptions

- **State Initialization:**
  - Load persisted state from workspace/global storage
  - Validate configuration settings
  - Initialize empty caches (don't preload data)
  - Set up configuration change listeners

- **Event Listeners:**
  - Document open/close events
  - Document change events (with debouncing)
  - Configuration change events
  - Workspace folder change events
  - All listeners must be added to `context.subscriptions`

- **Timing:**
  - Complete within 500ms
  - No synchronous file I/O during activation
  - No network requests
  - Defer heavy operations until first document opened

**Deactivation (`deactivate()` function):**

- **Resource Cleanup:**
  - Dispose all decoration types
  - Cancel all pending file operations (use cancellation tokens)
  - Clear all caches to free memory
  - Dispose all file watchers
  - Remove all diagnostics
  - Close output channel

- **State Persistence:**
  - Save current preview visibility state (if `defaultPreviewState: "remember"`)
  - Save per-document toggle states for restore on next session
  - Don't save cache data (regenerate on activation)

- **Timing:**
  - Complete within 1000ms
  - Don't block VS Code shutdown
  - Log deactivation to output channel (if still available)

**Error Handling:**

- Both `activate()` and `deactivate()` must never throw unhandled errors
- Catch and log all errors to output channel
- Extension failure should not crash VS Code
- Show error notification to user if activation fails critically

**Disposal Pattern:**

All resources that require cleanup must implement or use disposables:

```typescript
// Register disposable resources
context.subscriptions.push(
  decorationType,
  diagnosticCollection,
  fileWatcher,
  documentLinkProvider,
  codeLensProvider,
  hoverProvider,
  vscode.workspace.onDidChangeConfiguration(handler),
  vscode.workspace.onDidOpenTextDocument(handler),
  vscode.workspace.onDidCloseTextDocument(handler),
  vscode.workspace.onDidChangeTextDocument(handler)
);
```

**Resource Limits:**

- Maximum file watchers: 100 concurrent (dispose oldest if exceeded)
- Maximum cache entries: 100 items
- Maximum decoration types: 1 (reuse across all snippet lines)
- Maximum diagnostics per file: 500

### 5.5.2 Workspace State Persistence

Define what state persists across VS Code sessions and how it's managed.

**State Categories:**

**1. Per-Workspace State (survives restarts, workspace-specific):**

- Individual snippet preview visibility (which snippets are toggled on/off)
- Last global toggle state (all on vs all off) if `defaultPreviewState: "remember"`
- User's preferred base path if customized per-workspace
- Cached file watcher warnings (don't re-warn about same limits)

**2. Global State (survives restarts, applies to all workspaces):**

- Extension enabled/disabled state
- User's global preferences (if we add global settings in future)
- First-run flag (for showing welcome message, if implemented)

**3. Session-Only State (lost on reload):**

- Cached snippet content (must be regenerated)
- Resolved file paths (must be re-resolved)
- File system watchers (must be recreated)
- Decoration instances (must be recreated)

**Storage API Usage:**

```typescript
// Workspace state (workspace-specific)
context.workspaceState.update('snippetToggles', toggleStates);
const toggles = context.workspaceState.get('snippetToggles', {});

// Global state (applies everywhere)
context.globalState.update('extensionEnabled', true);
const enabled = context.globalState.get('extensionEnabled', true);
```

**State Structure:**

```typescript
// Per-snippet toggle state (workspace state)
interface SnippetToggleState {
  [documentUri: string]: {
    [lineNumber: number]: boolean; // true = visible, false = hidden
  };
}

// Global toggle state per document (workspace state)
interface GlobalToggleState {
  [documentUri: string]: boolean; // true = all visible, false = all hidden
}
```

**State Synchronization:**

- Save state when snippets are toggled (debounced, max once per second)
- Save state on document close
- Save state on extension deactivation
- Load state on extension activation
- Load state when document is opened

**State Cleanup:**

- Remove state for closed documents after 30 days (prevent unbounded growth)
- Provide "Clear All Cached States" command for user control
- Automatically remove invalid state entries (malformed data)

**State Migration:**

- If state format changes between versions, migrate gracefully
- Log migration events to output channel
- Fall back to defaults if migration fails
- Never crash on invalid state data

**Privacy:**

- State storage is local only (VS Code's storage API)
- No state sent to external servers
- State files located in VS Code's extension storage folder
- Can be cleared by uninstalling extension

### 5.6 Accessibility Requirements

#### 5.6.1 Visual Accessibility

- **High Contrast Mode Support:**
  - Use VS Code theme colors (`ThemeColor`) to automatically adapt to high contrast
    themes.
  - Test extension in high contrast dark and light themes.
  - Ensure ghost text maintains sufficient contrast and readability.
  - Verify error underlines are visible in high contrast mode.

- **Color Blindness:**
  - Do not rely solely on color (red underlines) to convey errors.
  - Include descriptive text-based error messages in diagnostics (already specified).
  - CodeLens icons should include text labels, not just color indicators.

- **Low Vision:**
  - Ghost text must respect user's font size settings.
  - Ensure sufficient contrast ratio (WCAG AA: 4.5:1 for normal text, 3:1 for large
    text).
  - Minimum ghost text size should not be smaller than 0.9em.

#### 5.5.2 Screen Reader Support

- **Hover Provider for Snippet Content:**
  - Implement a hover provider that shows snippet content in a tooltip.
  - This provides an accessible alternative to ghost text decorations, which are not
    read by screen readers.
  - Screen readers can access hover tooltips via keyboard navigation.

- **Diagnostics Accessibility:**
  - Error messages are automatically accessible via the Problems panel (VS Code
    handles this).
  - Screen readers announce diagnostics when the cursor moves to affected lines.

- **CodeLens Accessibility:**
  - CodeLens commands are keyboard accessible and readable by screen readers (VS Code
    handles this).
  - Use descriptive labels: "Show snippet content" not just "Show".

- **Alternative Command:**
  - Provide a command "MkDocs Snippet Lens: Copy Snippet Content to Output" that
    copies snippet content to the Output panel.
  - This provides another accessible way for screen reader users to review snippet
    content.

#### 5.5.3 Keyboard Navigation

- **Full Keyboard Access:**
  - All extension features must be accessible without a mouse.
  - Toggle commands available via keyboard shortcuts.
  - Document links work with Enter key (VS Code handles this automatically).
  - Tab navigation works naturally through UI elements.

- **Focus Management:**
  - When opening referenced files, focus moves to the opened file (VS Code default).
  - When toggling previews, focus remains on the current line.
  - No unexpected focus changes.

#### 5.5.4 Status Announcements

- **Toggle State Announcements:**
  - Display status bar message when toggling previews globally:
    - "All snippet previews shown"
    - "All snippet previews hidden"
  - Provides feedback for users who cannot see the visual changes.

#### 5.5.5 Cognitive Accessibility

- **Clear Visual Distinction:**
  - Ghost text must be clearly distinguishable from actual markdown content (italic,
    faded styling).
  - Limit default preview length to reduce cognitive load (20 lines default).
  - Use clear, descriptive error messages with actionable information.

- **Consistent Naming:**
  - Use consistent command and setting names throughout the extension.
  - Provide clear descriptions for all settings.
  - Use sensible defaults to minimize configuration needs.

#### 5.5.6 Motion and Animation

- **Reduce Motion:**
  - Do not use animations when showing/hiding previews.
  - Instant show/hide rather than fade effects.
  - Respect user's motion preferences (no unnecessary transitions).

#### 5.5.7 Testing Requirements

- **Screen Reader Testing:**
  - Test with NVDA or JAWS on Windows.
  - Test with VoiceOver on macOS.
  - Verify all features are accessible and announced properly.

- **High Contrast Testing:**
  - Test in "Dark High Contrast" theme.
  - Test in "Light High Contrast" theme.
  - Verify all visual elements are visible and distinguishable.

- **Keyboard-Only Testing:**
  - Perform complete workflow using only keyboard.
  - Verify all commands are reachable via keyboard shortcuts or command palette.

### 5.7 Success Metrics

These metrics measure extension quality and can be verified through automated testing
and development tooling without collecting user telemetry.

#### 5.7.1 Performance Metrics

**Activation Performance:**

- **Target:** Extension activation time < 500ms
- **Measurement:** Use VS Code's extension profiler or instrumentation during
  integration tests
- **Baseline:** Measure on CI/CD with standardized hardware (GitHub Actions runners)
- **Reporting:** Track in test output and fail build if threshold exceeded

**Operation Response Times:**

- **Target:** User-perceived actions complete in < 200ms
  - Snippet detection and decoration rendering
  - CodeLens toggle interaction
  - Document link activation
- **Measurement:** Add timing instrumentation in integration tests
- **Reporting:** Assert on timing thresholds in test suite

**Memory Usage:**

- **Target:** Memory footprint < 50MB for typical usage (10-20 files with snippets)
- **Ceiling:** < 200MB even with maximum configured limits
- **Measurement:** Use Node.js `process.memoryUsage()` in integration tests
- **Test Scenarios:**
  - Baseline: Extension activated but no files open
  - Typical: 10 markdown files with 5-10 snippets each
  - Heavy: 50 files with maximum configured snippets and large preview content
- **Reporting:** Assert memory usage stays within bounds during tests

**Bundle Size:**

- **Target:** Extension package (.vsix) < 5MB
- **Warning Threshold:** > 3MB triggers review of dependencies
- **Measurement:** Check file size in CI/CD build verification step
- **Reporting:** Fail build if > 5MB, warn if > 3MB

#### 5.7.2 Code Quality Metrics

**Test Coverage:**

- **Target:** 90%+ branch coverage
- **Critical Paths:** 100% coverage required for error handling, file I/O, path
  resolution
- **Measurement:** nyc/Istanbul during test execution
- **Reporting:** Coverage reports in CI/CD, fail build if below threshold
- **Trend:** Track coverage over time, prevent regression

**Linting and Type Safety:**

- **Target:** Zero ESLint errors and TypeScript type errors
- **Measurement:** Run `eslint` and `tsc --noEmit` in CI/CD
- **Reporting:** Fail build on any errors
- **Allowed:** Warnings are acceptable but should be reviewed regularly

**Build Success Rate:**

- **Target:** > 95% build success rate on main branch
- **Measurement:** Track CI/CD pipeline results over rolling 30-day window
- **Reporting:** GitHub Actions badges, manual review of trends
- **Investigation:** Any build failure should be investigated and fixed promptly

#### 5.7.3 Functional Correctness Metrics

**Test Execution:**

- **Target:** All tests passing on all supported platforms (Windows, macOS, Linux)
- **Measurement:** Run test suite in CI/CD matrix
- **Reporting:** Fail build on any test failure
- **Flakiness:** Maximum 2 retries for flaky tests, investigate persistent flakes

**Cross-Platform Compatibility:**

- **Target:** 100% of tests passing on Windows, macOS, and Linux
- **Measurement:** Platform-specific CI/CD runners
- **Reporting:** Matrix build status in GitHub Actions
- **Path Handling:** Special attention to Windows vs Unix path separators

**VS Code Version Compatibility:**

- **Target:** Extension works correctly on:
  - VS Code Stable (current release)
  - VS Code Insiders (pre-release)
  - Minimum supported version (1.85.0)
- **Measurement:** Test matrix with multiple VS Code versions
- **Reporting:** Matrix build results

#### 5.7.4 Security Metrics

**Dependency Vulnerabilities:**

- **Target:** Zero high or critical vulnerabilities in dependencies
- **Measurement:** `npm audit` in CI/CD
- **Reporting:** Fail build on high/critical vulnerabilities, create issues for
  moderate
- **Cadence:** Weekly scheduled scans plus on every dependency update

**Security Review:**

- **Target:** 100% coverage of security-critical code paths
  - Path traversal protection
  - Symlink resolution
  - File size limits
  - Permission handling
- **Measurement:** Manual code review + specific test cases
- **Reporting:** Security-focused test suite with explicit test names

#### 5.7.5 Release Quality Metrics

**Release Frequency:**

- **Target:** Regular releases following semantic versioning
- **Measurement:** Track time between releases, number of commits per release
- **Reporting:** Review release cadence quarterly
- **Balance:** Frequent enough for bug fixes, infrequent enough for stability

**Changelog Accuracy:**

- **Target:** 100% of user-facing changes documented in CHANGELOG
- **Measurement:** Manual review during release-please PR review
- **Enforcement:** Release-please automation generates changelog from conventional
  commits
- **Quality:** Meaningful commit messages that translate to clear changelog entries

**Documentation Currency:**

- **Target:** README and documentation match current extension behavior
- **Measurement:** Manual review before each release
- **Verification:** Test all code examples in documentation
- **Screenshots:** Update screenshots when UI changes

#### 5.7.6 Development Velocity Metrics

**Build Time:**

- **Target:** CI/CD pipeline completes in < 15 minutes
- **Measurement:** GitHub Actions execution time
- **Reporting:** Review build times monthly, optimize if exceeding threshold
- **Caching:** Use `node_modules` caching to improve speed

**Test Execution Time:**

- **Target:** Full test suite completes in < 5 minutes
- **Measurement:** Test runner output
- **Reporting:** Track test execution time trends
- **Optimization:** Parallelize tests, mock expensive operations

#### 5.7.7 Measurement and Reporting Strategy

**Automated Measurement:**

- All metrics measured automatically in CI/CD where possible
- No manual measurement for recurring metrics
- Use GitHub Actions outputs, test reporters, and build artifacts

**Reporting Locations:**

- **README Badges:** Build status, coverage percentage, version
- **CI/CD Logs:** Detailed metrics for each build
- **Test Reports:** Coverage reports, timing data, memory usage
- **GitHub Releases:** Performance comparison vs previous version (optional
  enhancement)

**Failure Response:**

- **Build Failures:** Block merging until resolved
- **Metric Degradation:** Investigate and address before release
- **Trends:** Monitor for gradual degradation (memory creep, slower tests)

**Review Cadence:**

- **Every PR:** Test coverage, lint errors, build success
- **Every Release:** All metrics reviewed, documented in release notes if noteworthy
- **Monthly:** Review trends (build times, memory usage, test execution time)
- **Quarterly:** Adjust targets if needed based on extension evolution

**Privacy Compliance:**

- All metrics measured in development/CI environment only
- No user data collection or telemetry from production usage
- Metrics based on automated testing with synthetic workloads
- Aligns with "no telemetry" privacy commitment

## 6. User Stories

1. **As a** technical writer, **I want** to click the filename in a snippet
   reference, **So that** I can quickly edit the source code without manually
   searching the file explorer.

2. **As a** reviewer, **I want** to see the code being snipped inline (ghost text),
   **So that** I can verify the context is correct without opening a new tab.

3. **As a** developer, **I want** the preview to be read-only and faded, **So that**
   I don't mistakenly try to edit the preview text thinking it is part of the
   markdown file.

## 7. Documentation Requirements

### 7.1 User Documentation

#### 7.1.1 README.md (Required)

The README must provide essential information for end users in a clear, scannable
format.

**Required Sections:**

- **Overview:** Brief description (2-3 sentences) of what the extension does and why
  it's useful
  - Target audience: MkDocs documentation authors
  - Key value proposition: "Preview MkDocs snippet content without leaving your
    editor"
  - Privacy statement: "Respects your privacy - no telemetry or data collection"

- **Features:** List of core capabilities with visual examples
  - Click to open snippet files
  - Preview snippet content inline (ghost text)
  - Toggle previews individually or globally
  - Each feature should include a screenshot or GIF demonstrating the feature
  - Limit to 3-5 key features to avoid overwhelming users

- **Installation:** How to install the extension
  - Link to VS Code Marketplace (when published)
  - Manual installation instructions (for development)

- **Quick Start:** Minimal steps to get started
  - Example: "Open a markdown file with `--8<--` snippet references and the extension
    activates automatically"
  - Basic keyboard shortcuts (global toggle)
  - One simple example with screenshot

- **Configuration:** List of available settings
  - Table format with setting name, description, default value
  - Only include user-facing settings (all `mkdocsLens.*` settings from Section 3)
  - Group related settings together

- **Known Limitations:** Be transparent about what's not supported
  - Multi-root workspaces (limited support)
  - Maximum file sizes and preview counts
  - Any MkDocs features not yet implemented

- **Privacy:** Explicit statement about data collection
  - "This extension collects no telemetry or usage data"
  - "All operations are performed locally on your machine"
  - "No network requests are made (except for extension updates via VS Code
    Marketplace)"

- **Support:** How to report issues and get help
  - Link to GitHub Issues
  - Note about checking existing issues first
  - What information to include in bug reports

**Optional but Recommended:**

- **Requirements:** Minimum VS Code version (1.85.0)
- **Examples:** More detailed usage scenarios with code samples
- **FAQ:** Common questions and troubleshooting tips (add as they arise)

**Quality Standards:**

- Keep language simple and jargon-free
- Use consistent terminology (e.g., always say "snippet" not "include")
- All screenshots should be up-to-date and show actual extension behavior
- Total length: 300-500 lines maximum to remain scannable
- Use proper markdown formatting (headers, lists, code blocks)

#### 7.1.2 CHANGELOG.md (Required)

Track all notable changes to the extension following [Keep a
Changelog](https://keepachangelog.com/) format.

**Required Elements:**

- **Format:** Semantic versioning (MAJOR.MINOR.PATCH)
- **Sections per version:**
  - `Added` - new features
  - `Changed` - changes to existing functionality
  - `Deprecated` - soon-to-be removed features
  - `Removed` - removed features
  - `Fixed` - bug fixes
  - `Security` - security fixes (if applicable)

- **Unreleased Section:** Track upcoming changes before release
- **Date Format:** ISO 8601 (YYYY-MM-DD)
- **Links:** Link version numbers to GitHub releases/tags

**Example:**

```markdown
## [Unreleased]

### Added
- Support for named section snippets

## [0.1.0] - 2025-12-15

### Added
- Initial release
- Click to open snippet files
- Ghost text preview of snippet content
- Toggle individual and all previews
```

#### 7.1.3 Visual Assets (Required for README)

- **Minimum Required:** 2 screenshots or GIFs
  - One showing the click-to-open feature
  - One showing the ghost text preview

- **Format:** PNG or GIF (animated GIFs preferred for interactions)
- **Size:** Max 1MB per image, width 800-1200px
- **Storage:** Store in `images/` or `media/` directory
- **Alt Text:** Always include descriptive alt text for accessibility

### 7.2 Developer Documentation

#### 7.2.1 Inline Code Documentation (Required)

All production code must include appropriate inline documentation for
maintainability.

**JSDoc/TSDoc Standards:**

- **Public APIs:** All exported functions, classes, and interfaces must have JSDoc
  comments
  - Description of purpose
  - `@param` for all parameters with types and descriptions
  - `@returns` for return values with type and description
  - `@throws` for exceptions that may be thrown
  - Examples for complex functions using `@example`

- **Complex Logic:** Add explanatory comments for:
  - Non-obvious algorithms (e.g., circular reference detection)
  - Security-critical code (path traversal prevention)
  - Performance optimizations
  - Workarounds for VS Code API limitations

- **Regular Expressions:** Always document regex patterns with:
  - Purpose of the pattern
  - Example matches/non-matches
  - Explanation of key groups or constructs

**Example:**

```typescript
/**
 * Resolves a snippet file path relative to the current document or workspace.
 *
 * @param snippetPath - The path from the snippet reference (may be relative or absolute)
 * @param documentUri - URI of the markdown document containing the snippet
 * @returns Resolved absolute URI of the snippet file
 * @throws {Error} If path resolves outside workspace (when protection enabled)
 *
 * @example
 * // Relative path
 * resolvePath("../src/example.py", documentUri)
 *
 * // Absolute path
 * resolvePath("/home/user/docs/snippet.txt", documentUri)
 */
function resolvePath(snippetPath: string, documentUri: vscode.Uri): vscode.Uri {
  // Implementation
}
```

#### 7.2.2 Architecture Documentation (Optional for v1.0)

**Scope:** Out of scope for initial release but should be added as codebase grows.

**Future Additions:**

- High-level architecture diagram showing component relationships
- Data flow diagrams for key features (snippet detection → parsing → rendering)
- Extension point documentation for potential contributions

### 7.3 Contribution Documentation

#### 7.3.1 CONTRIBUTING.md (Optional for v1.0)

**Scope:** Not required for initial release but recommended when ready to accept
external contributions.

**Should Include (when added):**

- Development environment setup instructions
- How to run tests and check coverage
- Code style guidelines (reference to ESLint config)
- Pull request process
- Code of conduct (reference to GitHub's default or create minimal version)

### 7.4 Marketplace Listing (Required for Publication)

When publishing to VS Code Marketplace, prepare:

**Required Fields:**

- **Display Name:** "MkDocs Snippet Lens"
- **Description:** Short description (max 200 characters)
  - "Preview and navigate MkDocs snippet references directly in your editor"
- **Categories:**
  - Primary: "Programming Languages"
  - Secondary: "Other"
- **Tags:** mkdocs, documentation, markdown, snippets, preview
- **Icon:** 128x128px PNG, recognizable at small sizes
- **Repository:** Link to GitHub repository
- **License:** Specify license type (e.g., MIT)

**Optional but Recommended:**

- **Gallery Banner:** Themed color and image
- **Getting Started:** Link to README section
- **Q&A:** Enable marketplace Q&A if ready to provide support

### 7.5 Documentation Maintenance

**Update Triggers:**

- **README:** Update when adding/removing features or changing usage
- **CHANGELOG:** Update with every release (maintain Unreleased section)
- **Code Documentation:** Update when modifying function signatures or behavior
- **Screenshots:** Update when UI changes significantly

**Review Cycle:**

- Review all documentation before each release
- Verify all links are working
- Ensure screenshots match current UI
- Update version numbers consistently

**Consistency Checks:**

- Extension name consistent across all docs
- Terminology consistent (use glossary if needed)
- Code examples tested and working
- Configuration examples match actual settings

### 7.6 Documentation Quality Standards

**Accessibility:**

- Use proper heading hierarchy (don't skip levels)
- Include alt text for all images
- Ensure code samples have language specified for syntax highlighting
- Use descriptive link text (not "click here")

**Clarity:**

- Write at 8th-grade reading level or below
- Define technical terms on first use
- Use active voice
- Keep sentences under 25 words when possible

**Accuracy:**

- Test all examples before publishing
- Verify settings exist and work as documented
- Update documentation immediately when behavior changes
- Include version info when behavior differs between versions

## 8. Testing Requirements

### 8.1 Coverage Targets

- **Overall Branch Coverage:** 90-100%
- **Critical Paths:** 100% coverage required for:
  - Error handling logic
  - File I/O operations
  - Path resolution
  - Circular reference detection
- **UI Components:** 80-90% coverage (CodeLens, decorations, diagnostics)

### 8.2 Test Types

#### 8.2.1 Unit Tests (70-80% of test suite)

- Test individual functions and classes in isolation
- Mock all VS Code API dependencies
- Fast execution without requiring a VS Code instance
- Use Mocha (VS Code standard) or Jest

**Key Areas to Cover:**

- Pattern matching for snippet syntax (all quote variations, edge cases)
- Path resolution logic (absolute, relative to file, relative to workspace)
- Section marker parsing and validation
- Recursive snippet expansion logic
- Circular reference detection algorithm
- Error message formatting

#### 8.2.2 Integration Tests (15-25% of test suite)

- Use `@vscode/test-electron` to run tests in real VS Code instance
- Test actual VS Code API interactions
- Verify components work together correctly

**Key Areas to Cover:**

- Document Link Provider returns correct links
- CodeLens Provider displays correctly
- Diagnostics are created with proper ranges and messages
- Text decorations are applied correctly
- File system operations via `workspace.fs` API

#### 8.2.3 End-to-End Tests (5-10% of test suite)

- Test complete user workflows in full VS Code instance
- Use workspace fixtures with realistic file structures

**Key Scenarios:**

- Open markdown file with snippets, verify links and previews appear
- Click snippet link, verify correct file opens
- Toggle preview via CodeLens, verify decoration appears/disappears
- Save file with new snippet, verify detection and rendering
- Test with missing files, verify error diagnostics appear

### 8.3 Test Fixtures

Create a standardized test workspace with:

- Sample markdown files with various snippet patterns
- Referenced snippet files (code, text, markdown)
- Edge cases:
  - Missing files (for error handling tests)
  - Files with circular references
  - Files with invalid section markers
  - Large files (for performance tests)
  - Files with nested snippets (multiple levels)
- Cross-platform path variations (Windows `\` vs Unix `/`)

### 8.4 Mocking Strategy

Mock VS Code APIs consistently:

- `workspace.fs.readFile` - for file I/O testing
- `workspace.getWorkspaceFolder` - for path resolution
- `window.createTextEditorDecorationType` - for decoration testing
- `languages.registerDocumentLinkProvider` - for link provider testing
- `languages.registerCodeLensProvider` - for CodeLens testing

Use dependency injection where possible to make mocking easier.

### 8.5 Testing Tools & Configuration

- **Test Framework:** Mocha (VS Code standard)
- **Assertion Library:** Chai or Node's built-in assert
- **Coverage Tool:** nyc (Istanbul)
- **VS Code Test Runner:** `@vscode/test-electron`

**Coverage Thresholds:**

```json
{
  "nyc": {
    "branches": 90,
    "lines": 90,
    "functions": 90,
    "statements": 90
  }
}
```

### 8.6 Continuous Integration

- Run tests on multiple platforms: Linux, macOS, Windows
- Generate and publish coverage reports
- Fail builds if coverage drops below threshold (90%)
- Run on every pull request and commit to main branch
- Test against multiple VS Code versions (current stable, previous stable, insiders)

### 8.7 Edge Cases to Test

**Pattern Matching:**

- Escaped quotes within file paths
- Spaces in file paths
- Unicode characters in paths
- Empty file paths
- Missing closing quote
- Multiple snippets on same line (if allowed)

**Path Resolution:**

- Absolute paths (Unix and Windows style)
- Relative paths with `..` navigation
- Paths with symbolic links
- Case sensitivity (macOS/Linux vs Windows)
- Paths exceeding OS limits

**Recursive Processing:**

- Snippets at maximum depth (100 levels)
- Immediate circular reference (A → A)
- Delayed circular reference (A → B → C → A)
- Mixed valid and circular references in same file

**Performance:**

- Large snippet files (approaching 1MB limit)
- Many snippets in single file (50+ snippets)
- Rapid typing/editing (debounce behavior)
- Opening multiple files simultaneously

**Error Conditions:**

- All error types from section 2.4 (missing files, invalid paths, permissions,
  invalid sections)
- Malformed snippet syntax
- File changes during processing
- Workspace folder not available

## 9. CI/CD and Release Management Requirements

### 9.1 Continuous Integration Pipeline

**Platform:** GitHub Actions

**Required Workflows:**

#### 9.1.1 Pull Request Validation (`pr-validation.yml`)

Runs on every pull request and push to main branch.

**Jobs:**

1. **Commit Message Validation**
   - Validate all commits in PR follow Conventional Commits specification
   - Use `wagoid/commitlint-github-action`
   - Fail if any commit is non-conventional
   - Provides detailed error messages for violations

2. **Lint and Type Check**
   - Run ESLint (`npm run lint`)
   - Run TypeScript compiler in check mode (`npm run check-types`)
   - Fail fast on any errors
   - Matrix: Not required (single run sufficient)

3. **Test Suite**
   - Run on matrix of platforms: `ubuntu-latest`, `macos-latest`, `windows-latest`
   - Run on matrix of VS Code versions: `stable`, `insiders`
   - Execute all tests (`npm test`)
   - Generate coverage report
   - Upload coverage to codecov.io or similar service
   - Fail if coverage drops below 90% threshold

4. **Build Verification**
   - Run production build (`npm run package`)
   - Verify .vsix package is created successfully
   - Check package size (warn if > 5MB)
   - Upload .vsix as workflow artifact for manual testing

**Performance Requirements:**

- Complete within 15 minutes under normal conditions
- Use caching for `node_modules` to speed up runs
- Parallel execution of independent jobs

**Required Checks:**

- All jobs must pass before PR can be merged (including commit message validation)
- At least one approving review required (repository setting)
- Branch must be up to date with main

#### 9.1.2 Security Scanning (`security.yml`)

Runs on schedule (weekly) and on pull requests.

**Jobs:**

1. **Dependency Audit**
   - Run `npm audit` to check for known vulnerabilities
   - Fail on high or critical vulnerabilities
   - Create issue automatically for moderate vulnerabilities

2. **CodeQL Analysis** (Optional but recommended)
   - Use GitHub's CodeQL action for JavaScript/TypeScript
   - Scan for security issues and code quality problems
   - Create alerts in Security tab

**Frequency:**

- Weekly scheduled run (every Monday)
- On pull requests that modify `package.json` or `package-lock.json`

### 9.2 Release Management with release-please

**Tool:** [release-please](https://github.com/googleapis/release-please) by Google

**Strategy:** Conventional Commits + Automated Changelog

#### 9.2.1 Release Please Configuration

**Commit Convention:** [Conventional Commits](https://www.conventionalcommits.org/)

**Required Commit Types:**

- `feat:` - New feature (triggers MINOR version bump)
- `fix:` - Bug fix (triggers PATCH version bump)
- `docs:` - Documentation changes (no version bump)
- `chore:` - Maintenance tasks (no version bump)
- `test:` - Test changes (no version bump)
- `refactor:` - Code refactoring (no version bump)
- `BREAKING CHANGE:` - Breaking change (triggers MAJOR version bump)
  - Include in commit footer or use `!` suffix: `feat!:`

**Example Commits:**

```text
feat: add support for named section snippets

fix: resolve path traversal vulnerability in symlink handling

docs: update README with new toggle commands

feat!: change default preview state to 'off'
BREAKING CHANGE: Users who relied on previews being on by default will need to update settings
```

**Configuration File:** `.release-please-manifest.json`

```json
{
  ".": "0.0.1"
}
```

**Config File:** `release-please-config.json`

```json
{
  "packages": {
    ".": {
      "release-type": "node",
      "package-name": "mkdocs-snippet-lens",
      "changelog-path": "CHANGELOG.md",
      "bump-minor-pre-major": true,
      "bump-patch-for-minor-pre-major": true,
      "extra-files": [
        "package.json"
      ]
    }
  }
}
```

#### 9.2.2 Release Workflow (`release.yml`)

**Trigger:** On push to `main` branch

**Jobs:**

1. **Create or Update Release PR**
   - Use `google-github-actions/release-please-action`
   - Analyzes commits since last release
   - Creates/updates a release PR with:
     - Updated version in `package.json`
     - Updated `CHANGELOG.md` with all changes
     - Git tag for the new version
   - Groups related changes by type (Features, Bug Fixes, etc.)

2. **Build and Publish** (runs only when release PR is merged)
   - Triggered by release-please creating a GitHub Release
   - Runs on `ubuntu-latest` only (publishing needs single run)
   - Steps:
     1. Checkout code at release tag
     2. Install dependencies (`npm ci`)
     3. Run tests (`npm test`)
     4. Build production package (`npm run package`)
     5. Publish to VS Code Marketplace using `@vscode/vsce`
     6. Upload .vsix to GitHub Release as asset

**Required Secrets:**

- `VSCE_PAT` - Personal Access Token for VS Code Marketplace publishing
  - Obtained from Azure DevOps for VS Code Marketplace
  - Stored in GitHub repository secrets
  - Scoped to marketplace publishing only

**Example Workflow Structure:**

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release-please:
    runs-on: ubuntu-latest
    outputs:
      release_created: ${{ steps.release.outputs.release_created }}
      tag_name: ${{ steps.release.outputs.tag_name }}
    steps:
      - uses: google-github-actions/release-please-action@v4
        id: release
        with:
          release-type: node
          package-name: mkdocs-snippet-lens

  publish:
    needs: release-please
    if: ${{ needs.release-please.outputs.release_created }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run package
      - run: npx @vscode/vsce publish -p ${{ secrets.VSCE_PAT }}
      - uses: actions/upload-release-asset@v1
        # Upload .vsix to GitHub Release
```

#### 9.2.3 Version Management

**Versioning Scheme:** Semantic Versioning (SemVer)

- **Format:** MAJOR.MINOR.PATCH (e.g., 1.2.3)
- **Initial Version:** 0.1.0 (pre-1.0 for initial development)
- **Pre-1.0 Behavior:**
  - Minor bumps for new features
  - Patch bumps for bug fixes
  - Breaking changes allowed without major bump (0.x.y is unstable)
- **Post-1.0 Behavior:**
  - Strict SemVer compliance
  - MAJOR for breaking changes
  - MINOR for new features
  - PATCH for bug fixes

**Version Sources:**

- Single source of truth: `package.json` `version` field
- Automatically updated by release-please
- Git tags created automatically (e.g., `v1.2.3`)

### 9.3 Marketplace Publishing Requirements

#### 9.3.1 Pre-Publish Checklist

Before first marketplace publication, ensure:

- [ ] Extension icon created (128x128px PNG)
- [ ] README.md complete with screenshots
- [ ] CHANGELOG.md initialized
- [ ] LICENSE file present (e.g., MIT)
- [ ] Repository URL set in `package.json`
- [ ] Publisher name registered on VS Code Marketplace
- [ ] `publisher` field in `package.json` matches registered publisher
- [ ] All required `package.json` metadata fields populated:
  - `displayName`
  - `description`
  - `categories`
  - `keywords`
  - `repository`
  - `bugs`
  - `license`

#### 9.3.2 Publishing Process

**Manual First Release:**

1. Create publisher account at <https://marketplace.visualstudio.com/manage>
2. Generate Personal Access Token in Azure DevOps
3. Add `VSCE_PAT` secret to GitHub repository
4. Tag and publish first version manually to verify setup:

   ```bash
   npm run package
   npx @vscode/vsce publish
   ```

5. Verify extension appears on marketplace
6. Test installation from marketplace

**Automated Subsequent Releases:**

1. Merge changes to `main` using conventional commits
2. Release-please creates/updates release PR automatically
3. Review and merge release PR
4. Workflow automatically publishes to marketplace
5. Verify new version appears on marketplace

#### 9.3.3 Rollback Procedure

If a published version has critical issues:

1. **Immediate Action:**
   - Unpublish broken version from marketplace (if possible)
   - Or publish hotfix version immediately

2. **Hotfix Process:**
   - Create hotfix branch from tag: `git checkout -b hotfix/v1.2.4 v1.2.3`
   - Fix the issue
   - Commit with `fix:` prefix
   - Open PR to main
   - Merge and let release-please create new version

3. **Communication:**
   - Update CHANGELOG with note about issue
   - Consider posting in marketplace Q&A
   - Update GitHub release notes if needed

### 9.4 Branch Protection and Workflow

**Protected Branch:** `main`

**Required Settings:**

- Require pull request reviews before merging (minimum 1 approval)
- Require status checks to pass:
  - Lint and Type Check
  - Test Suite (all platforms/versions)
  - Build Verification
- Require branches to be up to date before merging
- No force pushes allowed
- No deletions allowed

**Development Workflow:**

1. Create feature branch from `main`: `git checkout -b feat/my-feature`
2. Make changes using conventional commits
3. Push and create pull request
4. CI runs all checks
5. Request review
6. Merge to main (squash or merge commit)
7. Release-please automatically processes on main push

**Commit Message Enforcement:**

Conventional Commits are **required** for this project to support automated
versioning and changelog generation via release-please.

**Configuration:**

- **Commitlint:** `.commitlintrc.yml` with `@commitlint/config-conventional`
- **Supported types:** `build`, `ci`, `chore`, `docs`, `feat`, `fix`, `perf`,
  `refactor`, `revert`, `style`, `test`
- **Rules:**
  - Header max length: 100 characters
  - Type must be lowercase and non-empty
  - Subject must be lowercase, non-empty, no trailing period
  - Body and footer: 100 char line limit, blank line before each section

**Local Enforcement (commit-msg hook):**

- Use Husky to install Git hooks
- Install: `npx husky init` and configure commit-msg hook
- Hook runs commitlint on every commit
- **Blocks non-conforming commits** before they are created
- Provides immediate feedback to developers
- Hook file: `.husky/commit-msg`

**Example hook:**

```bash
#!/usr/bin/env sh
npx --no -- commitlint --edit $1
```

**CI/CD Enforcement (GitHub Actions):**

- Validate all commits in PR against conventional commits spec
- Job: `commitlint` in PR validation workflow
- **Fails build** if any commit is non-conventional
- Runs on: `pull_request` events
- Uses: `wagoid/commitlint-github-action`

**Example workflow job:**

```yaml
commitlint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    - uses: wagoid/commitlint-github-action@v6
```

**Developer Setup:**

1. Clone repository
2. Run `npm install` (installs husky automatically via prepare script)
3. Husky creates `.husky/` directory and hooks
4. Commit-msg hook validates all commits locally

**Benefits:**

- Prevents non-conventional commits from entering repository
- Ensures release-please can parse all commits correctly
- Generates accurate CHANGELOG automatically
- Consistent commit history across all contributors
- Fast feedback loop (fails at commit time, not PR time)

**Troubleshooting:**

- If hook doesn't run: `npx husky install`
- Skip hook in emergency: `git commit --no-verify` (discouraged)
- Reword last commit: `git commit --amend`
- Interactive rebase to fix old commits: `git rebase -i HEAD~n`

### 9.5 Environment and Secrets Management

**Required Secrets:**

- `VSCE_PAT` - VS Code Marketplace publishing token
  - Scope: Marketplace publishing
  - Rotation: Annually or if compromised
  - Access: Repository admins only

**Optional Secrets:**

- `CODECOV_TOKEN` - Code coverage reporting (if using codecov.io)
- `NPM_TOKEN` - If publishing to npm registry (not required for VS Code extensions)

**Environment Variables:**

- Use GitHub Actions built-in variables where possible
- No sensitive data in workflow files
- All secrets via GitHub Secrets only

### 9.6 Monitoring and Notifications

**Build Status:**

- Add status badges to README.md:
  - CI build status
  - Code coverage percentage
  - Latest release version
  - VS Code Marketplace version

**Notifications:**

- GitHub Actions failures notify via email (GitHub default)
- Consider Slack/Discord webhook for release notifications (optional)
- Monitor marketplace reviews and Q&A regularly

**Metrics to Track:**

- Installation count (from marketplace)
- Build success rate
- Average build time
- Code coverage trend
- Time from commit to release

### 9.7 Testing in CI/CD

**Test Execution:**

- Run full test suite on every PR and main push
- Use test retries for flaky tests (max 2 retries)
- Collect test results and publish as artifacts
- Display test summary in PR comments (optional enhancement)

**Coverage Reporting:**

- Generate coverage report in XML and HTML formats
- Upload to coverage service (codecov.io or coveralls.io)
- Comment on PR with coverage delta
- Block merge if coverage drops below 90%

**Cross-Platform Testing:**

- Test on Windows, macOS, and Linux simultaneously
- Fail fast: stop other jobs if one platform fails
- Archive platform-specific test results separately

### 9.8 Documentation in CI/CD

**Automated Checks:**

- Verify all links in README work (using markdown-link-check)
- Check markdown syntax (using markdownlint)
- Ensure CHANGELOG follows format (release-please validates this)
- Verify screenshots exist and are accessible

**Auto-Generated Docs:**

- TypeDoc for API documentation (optional, future enhancement)
- Publish to GitHub Pages on release (optional)
