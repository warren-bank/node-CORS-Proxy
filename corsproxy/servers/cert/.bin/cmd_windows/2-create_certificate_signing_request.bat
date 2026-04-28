@echo off

call "%~dp0.\env.bat"

set key_out=%localhost_key%
set crt_out=%localhost_csr%
if defined key_out if exist "%key_out%" del "%key_out%"
if defined crt_out if exist "%crt_out%" del "%crt_out%"

set openssl_opts=
set openssl_opts=%openssl_opts% req -nodes
set openssl_opts=%openssl_opts% -newkey "RSA:2048"
set openssl_opts=%openssl_opts% -subj "%subj%"
set openssl_opts=%openssl_opts% -keyout "%key_out%"
set openssl_opts=%openssl_opts% -out "%crt_out%"
set openssl_opts=%openssl_opts% -config "%openssl_config%"

openssl %openssl_opts%

echo.
pause
