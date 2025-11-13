# Perfect Indent

A smarter indentation fixer for Visual Studio Code.

Perfect Indent analyzes your code structure and automatically corrects broken indentation for ANY language.

![Perfect Indent](src/image/perfect-ident.png)

## ⭐ Features

- ✅ Fix indentation with one command  
- ✅ Detects tab/spaces automatically  
- ✅ Works with **30+ languages** including HTML, JS, TS, Vue, React, PHP, Python, JSON, CSS, YAML, XML, and more  
- ✅ Smart block-based indentation  
- ✅ Multiple keyboard shortcuts  
- ✅ Context menu integration  
- ✅ Works from file tabs (no need to click inside code)  
- ✅ Special handling for Markdown files  
- ✅ Ultra lightweight (no dependencies)

## 🚀 Usage

### Keyboard Shortcuts

You have **two options**:

1. **Primary shortcut:**
   - **Ctrl + Shift + I** (Windows/Linux)  
   - **Cmd + Shift + I** (macOS)

2. **Alternative shortcut:**
   - **Alt + Shift + I** (All platforms)

### Context Menu

Right-click on any file to access Perfect Indent:

- **File Explorer**: Right-click on file → **Perfect Indent**
- **Editor Tab**: Right-click on file tab → **Perfect Indent**
- **Code Editor**: Right-click inside code → **Perfect Indent**

### Command Palette

1. Press `Ctrl/Cmd + Shift + P`
2. Type: **Perfect Indent**
3. Select: **Perfect Indent: Fix indentation**

### Works Everywhere

- ✅ Click on file tab and press shortcut
- ✅ Right-click on file in explorer
- ✅ Right-click inside code editor
- ✅ Use Command Palette
- ✅ Works even without clicking inside the code!

## 💡 Perfect for

- **Messy pasted code** - Clean up code copied from different sources
- **Minified → reformatted** - Make minified code readable again
- **HTML/Blade/Vue/JSX components** - Fix nested HTML structures
- **Python blocks** - Correct Python indentation automatically
- **Legacy files** - Fix old files with inconsistent indentation
- **Quick fixes** - No need to manually fix indentation anymore

## 🌐 Supported Languages

Perfect Indent works with any language that uses block-based indentation:

### Web Technologies
- **HTML** / **XHTML** / **XML**
- **Vue** (`.vue` files with template, script, style)
- **Angular** (`.component.ts`, `.component.html`, `.module.ts`, `.service.ts`, `.routing.ts`)
- **React** / **JSX**
- **JavaScript** (`.js`, `.mjs`, `.cjs`)
- **TypeScript** (`.ts`, `.tsx`)
- **CSS** / **SCSS** / **SASS** / **LESS**
- **JSON** / **JSON5**

### Backend Languages
- **Python** (`.py`)
- **PHP** (`.php`, `.phtml`)
- **Ruby** (`.rb`)
- **Go** (`.go`)
- **Rust** (`.rs`)
- **Java** (`.java`)
- **C/C++** (`.c`, `.cpp`, `.h`)
- **C#** (`.cs`)
- **Kotlin** (`.kt`)
- **Swift** (`.swift`)

### Configuration & Data
- **YAML** (`.yaml`, `.yml`)
- **TOML** (`.toml`)
- **INI** (`.ini`)
- **Markdown** (`.md`, `.markdown`)

### Template Engines
- **Blade** (Laravel)
- **Twig** (Symfony)
- **Jinja2** (Python)
- **EJS** / **Handlebars**

### Other
- **Shell Scripts** (`.sh`, `.bash`, `.zsh`)
- **SQL** (`.sql`)
- **Lua** (`.lua`)
- **Perl** (`.pl`)
- And many more!

## 🎯 How It Works

Perfect Indent uses intelligent block-based detection to understand your code structure:

1. **Detects indentation style** - Automatically identifies tabs vs spaces and indent size (2 or 4 spaces)
2. **Analyzes code blocks** - Recognizes opening/closing blocks: `{}`, `[]`, `()`, HTML tags, keywords
3. **Fixes indentation** - Applies correct indentation level based on block nesting
4. **Prevents loops** - Smart comparison ensures it won't indent infinitely
5. **Preserves structure** - Maintains empty lines and code structure

## 📝 Special Features

### Markdown Support
- Special handling for Markdown files
- Preserves list indentation
- Prevents infinite loops
- Minimal indentation changes

### HTML/XML Support
- Detects HTML tags with attributes
- Handles self-closing tags correctly
- Works with Vue, Angular, and React templates
- Proper nesting detection

### Multi-Language
- Works with any language that uses block-based indentation
- No language-specific configuration needed
- Automatic detection and formatting

## 🛠️ Roadmap

### v1.0 ✅

✔ Fix básico por blocos  
✔ Detectar indent  
✔ Comando atalho  
✔ Context menu integration  
✔ Multiple keyboard shortcuts  
✔ HTML/XML support  
✔ Markdown special handling  

### v1.1 (Planned)

⬜ Ativar "Fix on Save"  
⬜ Configurações no VS Code  
⬜ Suporte especial para Python  
⬜ Custom indent size configuration  

### v1.2 (Planned)

⬜ Indentação inteligente por AST (análise da estrutura)  
⬜ Better handling of complex nested structures  

### v2.0 (Future)

⬜ "AI Indent Helper" (opcional, offline ou com IA local)  
⬜ Corrigir indentação por seleção  
⬜ Batch processing multiple files  

## 📦 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl/Cmd + Shift + X`)
3. Search for "Perfect Indent"
4. Click Install

### From VSIX File
1. Download `perfect-indent-0.0.1.vsix`
2. Open VS Code
3. Go to Extensions
4. Click "..." menu → "Install from VSIX..."
5. Select the downloaded file

## 🐛 Troubleshooting

**Q: The menu doesn't appear?**  
A: Reload VS Code window: `Ctrl/Cmd + Shift + P` → `Developer: Reload Window`

**Q: Indentation not working?**  
A: Make sure the file is saved (not "Untitled"). The extension works best with saved files.

**Q: Markdown files causing issues?**  
A: Markdown has special handling. If you encounter problems, try saving the file first.

**Q: HTML not indenting correctly?**  
A: Make sure HTML tags are properly formatted. The extension detects opening/closing tags automatically.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 👤 Author

Heber Almeida

- GitHub: [@heberalmeida](https://github.com/heberalmeida)
- Repository: [perfect-indent](https://github.com/heberalmeida/perfect-indent)

---

Made with ❤️ for developers.
