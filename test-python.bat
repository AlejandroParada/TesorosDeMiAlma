@echo off
echo ========================================
echo   🔍 Verificación de Python
echo ========================================
echo.

echo Probando 'py'...
py --version 2>nul
if %errorlevel% equ 0 (
    echo ✅ 'py' funciona
) else (
    echo ❌ 'py' no disponible
)

echo.
echo Probando 'python'...
python --version 2>nul
if %errorlevel% equ 0 (
    echo ✅ 'python' funciona
) else (
    echo ❌ 'python' no disponible
)

echo.
echo Probando 'python3'...
python3 --version 2>nul
if %errorlevel% equ 0 (
    echo ✅ 'python3' funciona
) else (
    echo ❌ 'python3' no disponible
)

echo.
echo ========================================
echo   📍 Ubicación de ejecutables
echo ========================================
where py 2>nul
where python 2>nul
where python3 2>nul

echo.
echo Presiona cualquier tecla para continuar...
pause >nul