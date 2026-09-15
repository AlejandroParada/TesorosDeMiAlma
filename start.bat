@echo off
echo ========================================
echo   📖 Tesoros de Mi Alma
echo ========================================
echo.

REM Verificar si Python está disponible (priorizar 'py' en Windows)
py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python detectado con 'py' - Iniciando servidor...
    echo.
    py server.py
) else (
    python --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Python detectado con 'python' - Iniciando servidor...
        echo.
        python server.py
    ) else (
        echo ⚠️  Python no detectado
        echo.
        echo Opciones disponibles:
        echo.
        echo 1. Instalar Python desde: https://www.python.org/downloads/
        echo 2. Abrir directamente index.html en tu navegador
        echo 3. Usar un servidor web local alternativo
        echo.
        echo Presiona cualquier tecla para abrir index.html...
        pause >nul
        start index.html
    )
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul