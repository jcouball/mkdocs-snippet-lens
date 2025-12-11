# VS Code Decoration Rendering Limitations

## Problem

VS Code's `TextEditorDecorationType` with `before.contentText` does NOT support multi-line rendering with actual line breaks. When you include `\n` in `contentText`, VS Code will:

1. Render it as a single line with visible newline characters
2. Or replace newlines with spaces
3. But NOT create actual visual line breaks

## Test to Verify

To create a test that would actually fail when multi-line rendering doesn't work, we need to:

1. **Capture the actual decoration being applied** (difficult - VS Code doesn't expose this)
2. **Use visual regression testing** (screenshot comparison)
3. **Test an alternative implementation** that we know works

## Alternative Implementations

### Option 1: Inline Preview with Symbols (Current Working)
```typescript
const inlineContent = formatForInlineDisplay(formattedContent); // Uses ⏎ symbols
```

### Option 2: Multiple Decorations (One per Line)
Create separate decorations for each line instead of trying to use newlines:

```typescript
// Instead of one decoration with newlines
const previewText = lines.join('\n');

// Use multiple decorations
for (let i = 0; i < lines.length; i++) {
  const decoration = {
    range: new vscode.Range(nextLine + i, 0, nextLine + i, 0),
    renderOptions: {
      before: { contentText: `  ${lines[i]}` }
    }
  };
}
```

### Option 3: Virtual Lines API (If Available)
Check if there's a newer VS Code API for virtual lines.

### Option 4: CodeLens
Show a clickable CodeLens above the snippet that expands/collapses the preview.

## Recommended Fix

Switch back to inline rendering with ⏎ symbols, or implement CodeLens-based preview expansion.
