@echo off

call "%~dp0.\env.bat"

openssl x509 -in "%localhost_crt%" -text -noout

echo.
pause
