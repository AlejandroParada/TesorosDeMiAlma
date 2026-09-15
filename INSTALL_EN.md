# 🚀 Installation Guide - Treasures of My Soul

## 📋 Usage Options

### Option 1: With Python (Recommended)
If you have Python installed:

```bash
# Complete server
py server.py          # Windows (recommended)
python server.py      # Linux/Mac/Windows alternative

# Simple server
py start.py           # Windows (recommended)
python start.py       # Linux/Mac/Windows alternative

# On Windows (double click)
start.bat             # Automatic Python detection
start-simple.bat      # Simplified version

# Check Python availability
test-python.bat       # Windows only
```

### Option 2: Without Python
1. Open `index.html` directly in your browser
2. Note: Local mode with limited content (only 2 chapters)
3. For complete content, install Python

### Option 3: With another web server
```bash
# With Node.js (if you have it installed)
npx http-server

# With PHP (if you have it installed)
php -S localhost:8000

# With Live Server (VS Code extension)
# Right-click on index.html > Open with Live Server
```

## 🐍 Python Installation (If you don't have it)

### Windows
1. Go to [python.org/downloads](https://www.python.org/downloads/)
2. Download Python 3.8 or higher
3. **IMPORTANT**: Check "Add Python to PATH" during installation
4. Restart your terminal/command prompt

### macOS
```bash
# With Homebrew
brew install python3

# Or download from python.org
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```

## ✅ Verify Installation

```bash
python --version
# Should show: Python 3.x.x
```

## 🔧 Troubleshooting

### "Python not found"
- **Windows**: Make sure you checked "Add to PATH" during installation
- **All**: Restart your terminal after installing Python
- **Windows**: Try `python3` instead of `python`

### "Port occupied"
The server automatically searches for a free port between 8000-8100.

### "CORS error"
If you open `index.html` directly without a server, some functions may fail. Use any local web server.

### "Files don't load"
Make sure you're running the command from the project directory where `index.html` is located.

## 🌐 Access URLs

Once the server is started:
- **Local**: http://localhost:8000
- **Local network**: http://YOUR_IP:8000 (to access from other devices)

## 📱 Mobile Device Usage

1. Make sure your computer and mobile are on the same WiFi network
2. Find your computer's IP:
   - **Windows**: `ipconfig`
   - **macOS/Linux**: `ifconfig` or `ip addr`
3. On mobile, go to: `http://YOUR_COMPUTER_IP:8000`

## 🔄 Update Project

If you download a new version:
1. Replace the files
2. Keep your content in `content/` if you've added translations
3. Restart the server

## 💡 Tips

- **Bookmarks**: Add specific chapters to bookmarks: `http://localhost:8000/?chapter=5`
- **Shortcuts**: Use Ctrl+← and Ctrl+→ for quick navigation
- **Responsive**: Works on any screen size
- **Offline**: Once loaded, works without internet