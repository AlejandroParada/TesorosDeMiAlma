#!/usr/bin/env python3
"""
Servidor web simple para Tesoros de Mi Alma (versión compatible)
Sin emojis para mayor compatibilidad con consolas Windows
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import mimetypes
from datetime import datetime

class BookHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler personalizado para servir el libro digital"""
    
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
        from urllib.parse import urlparse
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Redirigir la raíz a index.html
        if path == '/' or path == '':
            path = '/index.html'
            self.path = path
        
        # Servir archivos estáticos normalmente
        return super().do_GET()
    
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
    print("=" * 60)
    print("TESOROS DE MI ALMA - Servidor Web Local")
    print("=" * 60)
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists('index.html'):
        print("Error: No se encontro index.html")
        print("Asegurate de ejecutar el servidor desde el directorio del proyecto.")
        sys.exit(1)
    
    # Verificar archivos esenciales
    essential_files = ['index.html', 'styles/simple.css', 'js/book-clean.js', 'js/i18n.js', 'js/content-data.js']
    missing_files = [f for f in essential_files if not os.path.exists(f)]
    
    if missing_files:
        print("Advertencia: Faltan algunos archivos esenciales:")
        for file in missing_files:
            print(f"   - {file}")
        print()
    
    # Encontrar puerto disponible
    try:
        port = find_free_port()
    except RuntimeError as e:
        print(f"Error: {e}")
        sys.exit(1)
    
    # Configurar servidor
    handler = BookHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            server_url = f"http://localhost:{port}"
            
            print(f"Servidor iniciado exitosamente")
            print(f"URL: {server_url}")
            print(f"Directorio: {os.getcwd()}")
            print(f"Puerto: {port}")
            print()
            print("Caracteristicas disponibles:")
            print("   • Diseno responsive")
            print("   • Modo oscuro/claro")
            print("   • Control de tamaño de fuente")
            print("   • Soporte multiidioma (ES/EN/PT)")
            print("   • Atajos de teclado")
            print()
            print("Controles:")
            print("   • Ctrl + Izq/Der : Navegar capitulos")
            print("   • F1             : Mostrar/ocultar menu")
            print("   • Esc            : Cerrar menu")
            print()
            print("Para detener el servidor: Ctrl+C")
            print("=" * 60)
            
            # Intentar abrir el navegador
            try:
                webbrowser.open(server_url)
                print("Abriendo navegador...")
            except Exception as e:
                print(f"No se pudo abrir el navegador automaticamente: {e}")
                print(f"Abre manualmente: {server_url}")
            
            print()
            print("Log del servidor:")
            print("-" * 60)
            
            # Ejecutar servidor
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        print("Servidor detenido por el usuario")
        print("Gracias por usar Tesoros de Mi Alma!")
        print("=" * 60)
        sys.exit(0)
    except Exception as e:
        print(f"Error inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()