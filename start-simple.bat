@echo off
echo ========================================
echo   📖 Tesoros de Mi Alma - Inicio Rápido
echo ========================================
echo.

REM Verificar método de Python disponible
py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Iniciando con py...
    py start.py
    goto :end
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Iniciando con python...
    python start.py
    goto :end
)

python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Iniciando con python3...
    python3 start.py
    goto :end
)

REM Si no hay Python, abrir directamente
echo ⚠️  Python no disponible - Abriendo modo local...
echo.
echo 💡 Para mejor experiencia, instala Python desde:
echo    https://python.org/downloads
echo.
timeout /t 3 >nul
start index.html

:end
echo.
echo Presiona cualquier tecla para salir...
pause >nul