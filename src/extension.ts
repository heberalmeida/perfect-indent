import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let fixIndentCommand = vscode.commands.registerCommand("perfectIndent.fix", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage("No active editor found.");
            return;
        }

        const document = editor.document;
        const text = document.getText();

        if (!text.trim()) {
            vscode.window.showInformationMessage("Document is empty.");
            return;
        }

        try {
            const { indentChar, indentSize } = detectIndentation(text);
            const fixedText = fixIndentation(text, indentChar, indentSize);

            // Normalize both texts for comparison (remove trailing whitespace)
            const normalizedOriginal = text.split("\n").map(l => l.trimEnd()).join("\n");
            const normalizedFixed = fixedText.split("\n").map(l => l.trimEnd()).join("\n");

            if (normalizedFixed === normalizedOriginal) {
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
    
    // Closing HTML/XML/Vue tags
    if (/^<\/[^>]+>/.test(line)) {
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
    
    // Count opening braces, brackets, parentheses at the end
    const trailingOpeners = line.match(/[{\[\(]+$/);
    if (trailingOpeners) {
        count += trailingOpeners[0].length;
    }
    
    // HTML/XML/Vue opening tags (not self-closing, not closing tags, not comments)
    // This includes Vue template, script, style tags and all HTML elements
    const htmlTagMatch = line.match(/^<([a-zA-Z][a-zA-Z0-9-]*)[^>]*>$/);
    if (htmlTagMatch && 
        !line.endsWith("/>") && 
        !line.startsWith("</") &&
        !line.startsWith("<!--") &&
        !line.match(/^<\?/) &&
        !line.match(/^<!\[CDATA\[/)) {
        // Don't count self-closing tags like <br>, <img>, etc. if they end with />
        // But Vue components might be self-closing, so we check
        const tagName = htmlTagMatch[1].toLowerCase();
        const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
        if (!selfClosingTags.includes(tagName)) {
            count++;
        }
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
    if (line.endsWith(":") && 
        !line.startsWith("//") && 
        !line.startsWith("#") && 
        !line.startsWith("*") && 
        !line.match(/^[\s]*\/\//) && 
        !line.match(/https?:/) &&
        !line.match(/^[\s]*\*/)) {
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

