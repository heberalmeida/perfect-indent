import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let fixIndentCommand = vscode.commands.registerCommand("perfectIndent.fix", async (uri?: vscode.Uri | vscode.Uri[]) => {
        let editor: vscode.TextEditor | undefined;
        let document: vscode.TextDocument;
        
        // Handle URI from context menu (can be single URI or array)
        // VS Code automatically passes resourceUri when called from explorer/context
        let targetUri: vscode.Uri | undefined;
        if (uri) {
            if (Array.isArray(uri)) {
                targetUri = uri[0]; // Use first URI if array
            } else {
                targetUri = uri;
            }
        }
        
        // If URI is provided (from context menu), open that document
        if (targetUri) {
            try {
                // Check if it's a file (not a folder) - but don't fail if check fails
                try {
                    const stat = await vscode.workspace.fs.stat(targetUri);
                    if (stat.type === vscode.FileType.Directory) {
                        vscode.window.showWarningMessage("Please select a file, not a folder.");
                        return;
                    }
                } catch (statError) {
                    // If stat fails, continue anyway - might be a file that doesn't exist yet
                }
                
                document = await vscode.workspace.openTextDocument(targetUri);
                editor = await vscode.window.showTextDocument(document, { 
                    preview: false,
                    preserveFocus: false 
                });
            } catch (error: any) {
                // If opening fails, try to get the editor if file is already open
                const uriToCheck = targetUri;
                if (uriToCheck) {
                    const openEditor = vscode.window.visibleTextEditors.find(
                        e => e.document.uri.toString() === uriToCheck.toString()
                    );
                    if (openEditor) {
                        editor = openEditor;
                        document = openEditor.document;
                    } else {
                        vscode.window.showErrorMessage(`Failed to open file: ${error?.message || error}`);
                        return;
                    }
                } else {
                    vscode.window.showErrorMessage(`Failed to open file: ${error?.message || error}`);
                    return;
                }
            }
        } else {
            // Try to get active text editor first
            editor = vscode.window.activeTextEditor;
            
            // If no active editor, try to get from active tab group (when clicking on file tab)
            if (!editor) {
                const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
                if (activeTab && activeTab.input instanceof vscode.TabInputText) {
                    try {
                        document = await vscode.workspace.openTextDocument(activeTab.input.uri);
                        editor = await vscode.window.showTextDocument(document, { 
                            preview: false,
                            preserveFocus: false 
                        });
                    } catch (error) {
                        // Ignore error, continue with fallback
                    }
                }
            }
            
            // If still no editor, try to get from visible editors
            if (!editor && vscode.window.visibleTextEditors.length > 0) {
                // Try to find editor that matches active tab
                const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
                if (activeTab && activeTab.input instanceof vscode.TabInputText) {
                    const tabInput = activeTab.input as vscode.TabInputText;
                    editor = vscode.window.visibleTextEditors.find(
                        e => e.document.uri.toString() === tabInput.uri.toString()
                    );
                }
                
                // If still not found, use first visible editor
                if (!editor) {
                    editor = vscode.window.visibleTextEditors[0];
                }
            }
            
            // Last resort: try to open any text document from tabs
            if (!editor) {
                const allTabs = vscode.window.tabGroups.all
                    .flatMap(group => group.tabs)
                    .filter(tab => tab.input instanceof vscode.TabInputText)
                    .map(tab => (tab.input as vscode.TabInputText).uri);
                
                if (allTabs.length > 0) {
                    try {
                        document = await vscode.workspace.openTextDocument(allTabs[0]);
                        editor = await vscode.window.showTextDocument(document, { 
                            preview: false,
                            preserveFocus: false 
                        });
                    } catch (error) {
                        // Ignore error
                    }
                }
            }
            
            if (!editor) {
                vscode.window.showWarningMessage("Please open a file to fix indentation.");
                return;
            }
            
            document = editor.document;
        }
        
        // Ensure we have both editor and document
        if (!editor || !document) {
            vscode.window.showWarningMessage("Unable to access file editor. Please try again.");
            return;
        }
        
        // Check if document is read-only
        if (document.isUntitled) {
            vscode.window.showWarningMessage("Please save the file before fixing indentation.");
            return;
        }
        
        const text = document.getText();
        const languageId = document.languageId;

        if (!text.trim()) {
            vscode.window.showInformationMessage("Document is empty.");
            return;
        }

        // For Markdown, use minimal indentation (preserve list indentation only)
        if (languageId === 'markdown') {
            try {
                const fixedText = fixMarkdownIndentation(text);
                
                // Compare the actual text to see if indentation changed
                // Normalize line endings for comparison
                const normalizedOriginal = text.replace(/\r\n/g, '\n');
                const normalizedFixed = fixedText.replace(/\r\n/g, '\n');
                
                if (normalizedOriginal === normalizedFixed) {
                    vscode.window.showInformationMessage("Indentation is already correct!");
                    return;
                }

                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(text.length)
                );

                const success = await editor.edit(edit => {
                    edit.replace(fullRange, fixedText);
                });

                if (success) {
                    vscode.window.showInformationMessage("Indentation fixed! ✓");
                } else {
                    vscode.window.showWarningMessage("Failed to apply indentation changes.");
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Error fixing indentation: ${error}`);
            }
            return;
        }

        try {
            const { indentChar, indentSize } = detectIndentation(text);
            const fixedText = fixIndentation(text, indentChar, indentSize);

            // Compare the actual text (not hash) to see if indentation changed
            // Normalize line endings for comparison
            const normalizedOriginal = text.replace(/\r\n/g, '\n');
            const normalizedFixed = fixedText.replace(/\r\n/g, '\n');

            if (normalizedOriginal === normalizedFixed) {
                vscode.window.showInformationMessage("Indentation is already correct!");
                return;
            }

            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );

            const success = await editor.edit(edit => {
                edit.replace(fullRange, fixedText);
            });

            if (success) {
                vscode.window.showInformationMessage("Indentation fixed! ✓");
            } else {
                vscode.window.showWarningMessage("Failed to apply indentation changes.");
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error fixing indentation: ${error}`);
        }
    });

    context.subscriptions.push(fixIndentCommand);
}

// Simple hash function to detect if content changed
function simpleHash(text: string): string {
    // Remove all whitespace and compare structure
    return text.split("\n").map(l => l.trim()).join("\n");
}

// Minimal indentation fix for Markdown (only fixes list indentation)
function fixMarkdownIndentation(text: string): string {
    const lines = text.split("\n");
    const newLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Preserve empty lines
        if (!trimmed) {
            newLines.push("");
            continue;
        }
        
        // For markdown, preserve original indentation for lists and code blocks
        // Only fix obvious indentation issues (multiple spaces at start)
        const match = line.match(/^(\s*)(.*)$/);
        if (match) {
            const leadingSpaces = match[1];
            const content = match[2];
            
            // If line starts with list marker, preserve minimal indentation
            if (/^[-*+]\s/.test(content) || /^\d+\.\s/.test(content)) {
                // List items: use 0 or 2 spaces max
                const indentLevel = Math.min(leadingSpaces.length, 2);
                newLines.push(" ".repeat(indentLevel) + content);
            } else if (content.startsWith("```") || content.startsWith("~~~")) {
                // Code block markers: no indent
                newLines.push(content);
            } else {
                // Regular content: remove excessive leading spaces (keep max 2)
                const indentLevel = Math.min(leadingSpaces.length, 2);
                newLines.push(" ".repeat(indentLevel) + content);
            }
        } else {
            newLines.push(line);
        }
    }
    
    return newLines.join("\n");
}

interface IndentationConfig {
    indentChar: string;
    indentSize: number;
}

function detectIndentation(text: string): IndentationConfig {
    const lines = text.split("\n");
    let tabCount = 0;
    let spaceCounts: number[] = [];
    let totalIndentedLines = 0;
    const indentSizes: number[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue; // Skip empty lines
        
        const match = line.match(/^(\s+)/);
        if (match) {
            const indent = match[1];
            if (indent.includes("\t")) {
                tabCount++;
                totalIndentedLines++;
            } else if (indent.length > 0) {
                spaceCounts.push(indent.length);
                totalIndentedLines++;
                
                // Try to detect indent size by looking at consecutive indentation levels
                if (i > 0 && lines[i - 1].trim()) {
                    const prevMatch = lines[i - 1].match(/^(\s+)/);
                    if (prevMatch && !prevMatch[1].includes("\t")) {
                        const diff = indent.length - prevMatch[1].length;
                        if (diff > 0 && diff <= 8) {
                            indentSizes.push(diff);
                        }
                    }
                }
            }
        }
    }

    // Prefer tabs if more than 30% of indented lines use tabs
    if (tabCount > totalIndentedLines * 0.3) {
        return { indentChar: "\t", indentSize: 1 };
    }

    // Detect indent size from differences between consecutive lines
    if (indentSizes.length > 0) {
        const sizeCounts: { [key: number]: number } = {};
        for (const size of indentSizes) {
            sizeCounts[size] = (sizeCounts[size] || 0) + 1;
        }
        
        let mostCommonSize = 2;
        let maxCount = 0;
        for (const [size, count] of Object.entries(sizeCounts)) {
            const sizeNum = parseInt(size);
            if (count > maxCount) {
                mostCommonSize = sizeNum;
                maxCount = count;
            }
        }
        
        // Prefer 2 or 4 if they're close
        if (sizeCounts[2] && sizeCounts[2] >= maxCount * 0.5) {
            mostCommonSize = 2;
        } else if (sizeCounts[4] && sizeCounts[4] >= maxCount * 0.5) {
            mostCommonSize = 4;
        }
        
        return { indentChar: " ", indentSize: mostCommonSize };
    }

    // Detect most common space count (2, 4, or custom)
    if (spaceCounts.length > 0) {
        const counts: { [key: number]: number } = {};
        for (const count of spaceCounts) {
            counts[count] = (counts[count] || 0) + 1;
        }

        // Find most common, prefer 2 or 4
        let mostCommon = 4;
        let maxCount = 0;
        for (const [size, count] of Object.entries(counts)) {
            const sizeNum = parseInt(size);
            if (count > maxCount) {
                mostCommon = sizeNum;
                maxCount = count;
            }
        }
        
        // Normalize to common sizes (2, 4) if close
        if (mostCommon >= 1 && mostCommon <= 3) {
            mostCommon = 2;
        } else if (mostCommon >= 3 && mostCommon <= 5) {
            mostCommon = 4;
        }

        return { indentChar: " ", indentSize: mostCommon };
    }

    // Default to 2 spaces (common in Vue/JS projects)
    return { indentChar: " ", indentSize: 2 };
}

function fixIndentation(text: string, indentChar: string, indentSize: number): string {
    const lines = text.split("\n");
    const newLines: string[] = [];
    const indentStack: number[] = [0];
    let currentIndent = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const prevLine = i > 0 ? lines[i - 1].trim() : "";
        const nextLine = i < lines.length - 1 ? lines[i + 1]?.trim() : "";

        // Preserve empty lines
        if (!trimmed) {
            newLines.push("");
            continue;
        }

        // Calculate indent level based on opening/closing blocks
        const closingCount = countClosingBlocks(trimmed);
        const openingCount = countOpeningBlocks(trimmed, nextLine);

        // Decrease indent for closing blocks
        for (let j = 0; j < closingCount && currentIndent > 0; j++) {
            if (indentStack.length > 1) {
                indentStack.pop();
                currentIndent = indentStack[indentStack.length - 1];
            } else {
                currentIndent = 0;
            }
        }

        // Apply current indent
        const indent = indentChar.repeat(currentIndent * indentSize);
        newLines.push(indent + trimmed);

        // Increase indent for opening blocks
        for (let j = 0; j < openingCount; j++) {
            currentIndent++;
            indentStack.push(currentIndent);
        }
    }

    return newLines.join("\n");
}

function countClosingBlocks(line: string): number {
    let count = 0;
    
    // Count closing braces, brackets, parentheses at the start
    const leadingClosers = line.match(/^[}\]\)]+/);
    if (leadingClosers) {
        count += leadingClosers[0].length;
    }
    
    // Closing HTML/XML/Vue tags (improved to match anywhere in line)
    if (/<\/[^>]+>/.test(line)) {
        count++;
    }
    
    // Closing keywords
    const closingKeywords = [
        /^endif\b/, /^endfor\b/, /^endforeach\b/, /^endwhile\b/,
        /^endfunction\b/, /^endclass\b/, /^enddef\b/, /^end\b/,
        /^#endif/, /^#end\b/
    ];
    if (closingKeywords.some(regex => regex.test(line))) {
        count++;
    }
    
    return count;
}

function countOpeningBlocks(line: string, nextLine: string): number {
    let count = 0;
    
    // Don't count if line is only closing
    if (/^[}\]\)]+$/.test(line) && !line.match(/[{\[\(]/)) {
        return 0;
    }
    
    // Don't count markdown list markers as opening blocks
    if (/^[-*+]\s/.test(line) || /^\d+\.\s/.test(line)) {
        return 0;
    }
    
    // Count opening braces, brackets, parentheses at the end
    const trailingOpeners = line.match(/[{\[\(]+$/);
    if (trailingOpeners) {
        count += trailingOpeners[0].length;
    }
    
    // HTML/XML/Vue opening tags (not self-closing, not closing tags, not comments)
    // Improved regex to match tags even with attributes on the same line
    // Match opening tags like <div>, <div class="...">, etc.
    const htmlTagRegex = /<([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?>/g;
    let match;
    let hasOpeningTag = false;
    
    while ((match = htmlTagRegex.exec(line)) !== null) {
        const fullTag = match[0];
        const tagName = match[1].toLowerCase();
        
        // Skip if it's a closing tag, comment, or special tag
        if (fullTag.startsWith('</') || 
            fullTag.includes('<!--') || 
            fullTag.startsWith('<?') ||
            fullTag.includes('<![')) {
            continue;
        }
        
        // Skip self-closing tags
        if (fullTag.endsWith('/>') || fullTag.includes('/>')) {
            continue;
        }
        
        // Skip known self-closing HTML tags
        const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
        if (selfClosingTags.includes(tagName)) {
            continue;
        }
        
        // This is an opening tag that should increase indent
        hasOpeningTag = true;
        break; // Only count once per line
    }
    
    if (hasOpeningTag) {
        count++;
    }
    
    // JavaScript/Python keywords that open blocks
    const openingKeywords = [
        /^if\s+/, /^elif\s+/, /^for\s+/, /^foreach\s+/,
        /^while\s+/, /^function\s+/, /^class\s+/, /^def\s+/, /^do\s*$/,
        /^try\s*:/, /^except\s*:/, /^finally\s*:/, /^with\s+/,
        /^#if/, /^#\s*if/
    ];
    if (openingKeywords.some(regex => regex.test(line))) {
        count++;
    }
    
    // Lines ending with colon (Python, YAML, etc.) - but not comments or URLs
    // Exclude markdown headers (###) and list items
    if (line.endsWith(":") && 
        !line.startsWith("//") && 
        !line.startsWith("#") && 
        !line.startsWith("*") && 
        !line.match(/^[\s]*\/\//) && 
        !line.match(/https?:/) &&
        !line.match(/^[\s]*\*/) &&
        !line.match(/^#{1,6}\s/)) { // Exclude markdown headers
        // Only increase if next line is not empty and not a closing tag
        if (nextLine && nextLine.trim()) {
            const nextClosing = countClosingBlocks(nextLine);
            if (nextClosing === 0) {
                count++;
            }
        } else {
            count++;
        }
    }
    
    // Special case: "else", "elseif", "catch" - these should align with their opening
    // but the block after them should be indented
    if (/^(else|elseif|catch|finally)\s*/.test(line) && line.includes("{")) {
        count++;
    }
    
    return count;
}

export function deactivate() {}

