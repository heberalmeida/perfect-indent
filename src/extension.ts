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

            if (fixedText === text) {
                vscode.window.showInformationMessage("Indentation is already correct!");
                return;
            }

            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );

            await editor.edit(edit => {
                edit.replace(fullRange, fixedText);
            });

            vscode.window.showInformationMessage("Indentation fixed! ✓");
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
    let totalLines = 0;

    for (const line of lines) {
        if (!line.trim()) continue; // Skip empty lines
        
        const match = line.match(/^(\s+)/);
        if (match) {
            const indent = match[1];
            if (indent.includes("\t")) {
                tabCount++;
            } else {
                spaceCounts.push(indent.length);
            }
            totalLines++;
        }
    }

    // Prefer tabs if more than 30% of indented lines use tabs
    if (tabCount > totalLines * 0.3) {
        return { indentChar: "\t", indentSize: 1 };
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
            if (count > maxCount || (sizeNum === 2 || sizeNum === 4)) {
                mostCommon = sizeNum;
                maxCount = count;
            }
        }

        return { indentChar: " ", indentSize: mostCommon };
    }

    // Default to 4 spaces
    return { indentChar: " ", indentSize: 4 };
}

function fixIndentation(text: string, indentChar: string, indentSize: number): string {
    const lines = text.split("\n");
    const newLines: string[] = [];
    let indentLevel = 0;
    const indentStack: number[] = [0];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Preserve empty lines
        if (!trimmed) {
            newLines.push("");
            continue;
        }

        // Decrease indent for closing blocks
        if (
            trimmed === "}" ||
            trimmed === "]" ||
            trimmed === ")" ||
            trimmed.startsWith("</") ||
            trimmed === "endif" ||
            trimmed === "endfor" ||
            trimmed === "endforeach" ||
            trimmed === "endwhile" ||
            trimmed === "endfunction" ||
            trimmed === "endclass" ||
            trimmed === "enddef" ||
            trimmed.startsWith("#endif") ||
            trimmed.startsWith("#end")
        ) {
            if (indentStack.length > 1) {
                indentStack.pop();
            }
            indentLevel = indentStack[indentStack.length - 1];
        }

        // Apply current indent
        const indent = indentChar.repeat(indentLevel * indentSize);
        newLines.push(indent + trimmed);

        // Increase indent for opening blocks
        if (
            trimmed.endsWith("{") ||
            trimmed.endsWith("[") ||
            trimmed.endsWith("(") ||
            (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && trimmed.endsWith(">")) ||
            trimmed.endsWith(":") && !trimmed.startsWith("//") && !trimmed.startsWith("#") && !trimmed.startsWith("//") ||
            trimmed === "do" ||
            trimmed.startsWith("if ") ||
            trimmed.startsWith("else") ||
            trimmed.startsWith("for ") ||
            trimmed.startsWith("foreach ") ||
            trimmed.startsWith("while ") ||
            trimmed.startsWith("function ") ||
            trimmed.startsWith("class ") ||
            trimmed.startsWith("def ") ||
            trimmed.startsWith("#if")
        ) {
            // Don't increase if line ends with closing brace (e.g., "} else {")
            if (!trimmed.endsWith("}") && !trimmed.endsWith("]") && !trimmed.endsWith(")")) {
                indentLevel++;
                indentStack.push(indentLevel);
            }
        }
    }

    return newLines.join("\n");
}

export function deactivate() {}

