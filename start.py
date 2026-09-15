#!/usr/bin/env python3
"""
Script de inicio rápido para Tesoros de Mi Alma
Versión simplificada del servidor para inicio rápido
"""

import http.server
import socketserver
import webbrowser
import os

def start_book_server():
    """Iniciar el servidor del libro de forma simple"""
    
    # Verificar que index.html existe
    if not os.path.exists('index.html'):
        print("❌ Error: Ejecuta este script desde el directorio del proyecto")
        return
    
    PORT = 8000
    
    # Intentar varios puertos si el 8000 está ocupado
    for port in range(8000, 8010):
        try:
            Handler = http.server.SimpleHTTPRequestHandler
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}"
                print(f"📖 Tesoros de Mi Alma")
                print(f"🚀 Servidor iniciado en: {url}")
                print("🛑 Presiona Ctrl+C para detener")
                
                # Abrir navegador
                try:
                    webbrowser.open(url)
                except:
                    pass
                
                httpd.serve_forever()
        except OSError:
            continue
    
    print("❌ No se pudo iniciar el servidor en ningún puerto")

if __name__ == "__main__":
    try:
        start_book_server()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")