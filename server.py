#!/usr/bin/env python3
"""
Servidor web simple para Tesoros de Mi Alma
Servidor HTTP básico para servir el libro digital sin dependencias adicionales
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from urllib.parse import urlparse, parse_qs
import mimetypes
import json
from datetime import datetime

class BookHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Handler personalizado para servir el libro digital
    """
    
    def __init__(self, *args, **kwargs):
        # Configurar tipos MIME adicionales
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('text/css', '.css')
        mimetypes.add_type('text/markdown', '.md')
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        """Añadir headers de seguridad y CORS"""
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        """Manejar peticiones GET"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Redirigir la raíz a index.html
        if path == '/' or path == '':
            path = '/index.html'
            self.path = path
        
        # Servir archivos estáticos normalmente
        return super().do_GET()
    
    def guess_type(self, path):
        """Determinar el tipo MIME del archivo"""
        mimetype, encoding = mimetypes.guess_type(path)
        
        # Tipos MIME específicos para nuestros archivos
        if path.endswith('.md'):
            return 'text/markdown; charset=utf-8'
        elif path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        elif path.endswith('.css'):
            return 'text/css; charset=utf-8'
        elif path.endswith('.html'):
            return 'text/html; charset=utf-8'
        elif path.endswith('.json'):
            return 'application/json; charset=utf-8'
        
        if mimetype:
            return mimetype
        else:
            return 'application/octet-stream'
    
    def log_message(self, format, *args):
        """Log personalizado con timestamp"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

def find_free_port(start_port=8000, max_port=8100):
    """Encontrar un puerto libre para el servidor"""
    import socket
    
    for port in range(start_port, max_port):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    
    raise RuntimeError(f"No se pudo encontrar un puerto libre entre {start_port} y {max_port}")

def main():
    """Función principal del servidor"""
    # Configurar encoding para Windows
    import sys
    if sys.platform == 'win32':
        import os
        os.system('chcp 65001 > nul 2>&1')  # UTF-8
    
    print("=" * 60)
    try:
        print("📖 TESOROS DE MI ALMA - Servidor Web Local")
    except UnicodeEncodeError:
        print("TESOROS DE MI ALMA - Servidor Web Local")
    print("=" * 60)
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists('index.html'):
        try:
            print("❌ Error: No se encontró index.html")
        except UnicodeEncodeError:
            print("Error: No se encontro index.html")
        print("   Asegurate de ejecutar el servidor desde el directorio del proyecto.")
        sys.exit(1)
    
    # Verificar archivos esenciales
    essential_files = ['index.html', 'styles/main.css', 'js/main.js', 'js/i18n.js', 'js/book.js']
    missing_files = [f for f in essential_files if not os.path.exists(f)]
    
    if missing_files:
        try:
            print("⚠️  Advertencia: Faltan algunos archivos esenciales:")
        except UnicodeEncodeError:
            print("Advertencia: Faltan algunos archivos esenciales:")
        for file in missing_files:
            print(f"   - {file}")
        print()
    
    # Encontrar puerto disponible
    try:
        port = find_free_port()
    except RuntimeError as e:
        try:
            print(f"❌ Error: {e}")
        except UnicodeEncodeError:
            print(f"Error: {e}")
        sys.exit(1)
    
    # Configurar servidor
    handler = BookHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            server_url = f"http://localhost:{port}"
            
            try:
                print(f"🚀 Servidor iniciado exitosamente")
                print(f"🌐 URL: {server_url}")
                print(f"📁 Directorio: {os.getcwd()}")
                print(f"🎯 Puerto: {port}")
                print()
                print("💡 Características disponibles:")
                print("   • 📱 Diseño responsive")
                print("   • 🌓 Modo oscuro/claro")
                print("   • 🔤 Control de tamaño de fuente")
                print("   • 🌍 Soporte para Español, Inglés y Portugués")
                print("   • ⌨️  Atajos de teclado (Ctrl+←/→, F1, Esc)")
                print()
                print("🎮 Controles:")
                print("   • Ctrl + ← : Capítulo anterior")
                print("   • Ctrl + → : Capítulo siguiente") 
                print("   • F1       : Mostrar/ocultar menú lateral")
                print("   • Esc      : Cerrar menú lateral (móvil)")
                print()
                print("🛑 Para detener el servidor: Ctrl+C")
            except UnicodeEncodeError:
                print(f"Servidor iniciado exitosamente")
                print(f"URL: {server_url}")
                print(f"Directorio: {os.getcwd()}")
                print(f"Puerto: {port}")
                print()
                print("Caracteristicas disponibles:")
                print("   • Diseno responsive")
                print("   • Modo oscuro/claro")
                print("   • Control de tamaño de fuente")
                print("   • Soporte para Español, Ingles y Portugues")
                print("   • Atajos de teclado (Ctrl+<-/->, F1, Esc)")
                print()
                print("Controles:")
                print("   • Ctrl + <- : Capitulo anterior")
                print("   • Ctrl + -> : Capitulo siguiente") 
                print("   • F1        : Mostrar/ocultar menu lateral")
                print("   • Esc       : Cerrar menu lateral (movil)")
                print()
                print("Para detener el servidor: Ctrl+C")
            print("=" * 60)
            
            # Intentar abrir el navegador
            try:
                webbrowser.open(server_url)
                try:
                    print("🌐 Abriendo navegador...")
                except UnicodeEncodeError:
                    print("Abriendo navegador...")
            except Exception as e:
                try:
                    print(f"⚠️  No se pudo abrir el navegador automáticamente: {e}")
                except UnicodeEncodeError:
                    print(f"No se pudo abrir el navegador automaticamente: {e}")
                print(f"   Abre manualmente: {server_url}")
            
            print()
            try:
                print("📊 Log del servidor:")
            except UnicodeEncodeError:
                print("Log del servidor:")
            print("-" * 60)
            
            # Ejecutar servidor
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        try:
            print("🛑 Servidor detenido por el usuario")
            print("📖 ¡Gracias por usar Tesoros de Mi Alma!")
        except UnicodeEncodeError:
            print("Servidor detenido por el usuario")
            print("Gracias por usar Tesoros de Mi Alma!")
        print("=" * 60)
        sys.exit(0)
    except Exception as e:
        try:
            print(f"❌ Error inesperado: {e}")
        except UnicodeEncodeError:
            print(f"Error inesperado: {e}")
        sys.exit(1)

def show_help():
    """Mostrar ayuda del servidor"""
    help_text = """
🔧 TESOROS DE MI ALMA - Servidor Web Local

USO:
    python server.py [opciones]

OPCIONES:
    -h, --help     Mostrar esta ayuda
    -v, --version  Mostrar versión

DESCRIPCIÓN:
    Servidor web simple para servir el libro digital "Tesoros de Mi Alma".
    No requiere instalación de dependencias adicionales.

CARACTERÍSTICAS:
    • Servidor HTTP básico con Python
    • Auto-detección de puerto libre
    • Headers de seguridad básicos
    • Logging con timestamp
    • Auto-apertura del navegador

REQUISITOS:
    • Python 3.6 o superior
    • Archivos del proyecto en el directorio actual

EJEMPLOS:
    python server.py              # Iniciar servidor
    python server.py --help       # Mostrar ayuda
    
Para más información, visita: https://github.com/tu-usuario/tesoros-de-mi-alma
"""
    print(help_text)

def show_version():
    """Mostrar versión del servidor"""
    print("Tesoros de Mi Alma Server v1.0.0")
    print("Python HTTP Server para libro digital")

if __name__ == "__main__":
    # Manejar argumentos de línea de comandos
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg in ['-h', '--help']:
            show_help()
            sys.exit(0)
        elif arg in ['-v', '--version']:
            show_version()
            sys.exit(0)
        else:
            print(f"❌ Argumento desconocido: {arg}")
            print("Usa 'python server.py --help' para ver las opciones disponibles.")
            sys.exit(1)
    
    main()