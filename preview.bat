@echo off
title FoxRe Wiki Local Preview Server
echo ======================================================================
echo   Starting FoxRe Interactive Documentation Portal Preview Server...
echo ======================================================================

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    python "%~dp0preview.py"
    goto end
)

where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
    py "%~dp0preview.py"
    goto end
)

if exist "C:\Python313\python.exe" (
    "C:\Python313\python.exe" "%~dp0preview.py"
    goto end
)

echo [ERROR] Python not found in PATH or standard locations.
echo Please install Python 3 or add it to PATH.
pause

:end
