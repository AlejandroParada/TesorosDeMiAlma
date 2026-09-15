# 🚀 Guía de Instalación - Tesoros de Mi Alma

## 📋 Opciones de Uso

### Opción 1: Con Python (Recomendado)
Si tienes Python instalado:

```bash
# Servidor completo
py server.py          # Windows (recomendado)
python server.py      # Linux/Mac/Windows alternativo

# Servidor simple
py start.py           # Windows (recomendado)  
python start.py       # Linux/Mac/Windows alternativo

# En Windows (doble clic)
start.bat             # Detección automática de Python
start-simple.bat      # Versión simplificada

# Verificar Python disponible
test-python.bat       # Solo Windows
```

### Opción 2: Sin Python
1. Abre directamente `index.html` en tu navegador
2. Nota: Modo local con contenido limitado (solo 2 capítulos)
3. Para contenido completo, instala Python

### Opción 3: Con otro servidor web
```bash
# Con Node.js (si lo tienes instalado)
npx http-server

# Con PHP (si lo tienes instalado)  
php -S localhost:8000

# Con Live Server (extensión de VS Code)
# Clic derecho en index.html > Open with Live Server
```

## 🐍 Instalación de Python (Si no lo tienes)

### Windows
1. Ve a [python.org/downloads](https://www.python.org/downloads/)
2. Descarga Python 3.8 o superior
3. **IMPORTANTE**: Marca "Add Python to PATH" durante la instalación
4. Reinicia tu terminal/símbolo del sistema

### macOS
```bash
# Con Homebrew
brew install python3

# O descarga desde python.org
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```

## ✅ Verificar Instalación

```bash
python --version
# Debería mostrar: Python 3.x.x
```

## 🔧 Solución de Problemas

### "Python no encontrado"
- **Windows**: Asegúrate de haber marcado "Add to PATH" durante la instalación
- **Todos**: Reinicia tu terminal después de instalar Python
- **Windows**: Intenta `python3` en lugar de `python`

### "Puerto ocupado"
El servidor automáticamente busca un puerto libre entre 8000-8100.

### "Error de CORS"
Si abres `index.html` directamente sin servidor, algunas funciones pueden fallar. Usa cualquier servidor web local.

### "Archivos no cargan"
Asegúrate de estar ejecutando el comando desde el directorio del proyecto donde está `index.html`.

## 🌐 URLs de Acceso

Una vez iniciado el servidor:
- **Local**: http://localhost:8000
- **Red local**: http://TU_IP:8000 (para acceder desde otros dispositivos)

## 📱 Uso en Dispositivos Móviles

1. Asegúrate de que tu computadora y móvil están en la misma red WiFi
2. Encuentra la IP de tu computadora:
   - **Windows**: `ipconfig`
   - **macOS/Linux**: `ifconfig` o `ip addr`
3. En el móvil, ve a: `http://IP_DE_TU_COMPUTADORA:8000`

## 🔄 Actualizar el Proyecto

Si descargas una nueva versión:
1. Reemplaza los archivos
2. Mantén tu contenido en `content/` si has añadido traducciones
3. Reinicia el servidor

## 💡 Consejos

- **Marcadores**: Añade capítulos específicos a marcadores: `http://localhost:8000/?chapter=5`
- **Atajos**: Usa Ctrl+← y Ctrl+→ para navegación rápida
- **Responsive**: Funciona en cualquier tamaño de pantalla
- **Offline**: Una vez cargado, funciona sin internet