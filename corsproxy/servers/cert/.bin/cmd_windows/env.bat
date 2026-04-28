@echo off

set openssl_HOME=C:\PortableApps\OpenSSL\1.1.0
set openssl_config=%openssl_HOME%\openssl.cnf
set PATH=%openssl_HOME%;%PATH%

set country_name=US
set state_name=NV
set locality_name=Las Vegas
set organization_name=CORS-proxy
set organization_unit=CORS-proxy
set common_name=CORS-proxy

set subj=/C=%country_name%/ST=%state_name%/L=%locality_name%/O=%organization_name%/OU=%organization_unit%/CN=%common_name%
set days=36500

set ca_key=ca.key
set ca_crt=ca.crt

set localhost_key=localhost.key
set localhost_csr=localhost.csr
set localhost_crt=localhost.crt
set localhost_passphrase=CORS-proxy
set localhost_extfile=%~dp0..\etc\extfile_localhost.txt

cd /D "%~dp0..\.."
