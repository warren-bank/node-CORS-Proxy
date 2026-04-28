@echo off

call "%~dp0.\env.bat"

set key_out=
set crt_out=%localhost_crt%
if defined key_out if exist "%key_out%" del "%key_out%"
if defined crt_out if exist "%crt_out%" del "%crt_out%"

set openssl_opts=
set openssl_opts=%openssl_opts% x509 -req
set openssl_opts=%openssl_opts% -days "%days%"
set openssl_opts=%openssl_opts% -CAcreateserial
set openssl_opts=%openssl_opts% -CAkey "%ca_key%"
set openssl_opts=%openssl_opts% -CA "%ca_crt%"
set openssl_opts=%openssl_opts% -in "%localhost_csr%"
set openssl_opts=%openssl_opts% -out "%crt_out%"
set openssl_opts=%openssl_opts% -passin "pass:%localhost_passphrase%"
set openssl_opts=%openssl_opts% -extfile "%localhost_extfile%"

openssl %openssl_opts%

echo.
pause
