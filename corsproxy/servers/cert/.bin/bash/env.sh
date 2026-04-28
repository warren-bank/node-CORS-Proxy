#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

openssl_HOME='/c/PortableApps/OpenSSL/1.1.0'
export openssl_config="${openssl_HOME}/openssl.cnf"
export PATH="${openssl_HOME}:${PATH}"

country_name='US'
state_name='NV'
locality_name='Las Vegas'
organization_name='CORS-proxy'
organization_unit='CORS-proxy'
common_name='CORS-proxy'

# https://stackoverflow.com/a/31990313
export subj="//C=${country_name}\ST=${state_name}\L=${locality_name}\O=${organization_name}\OU=${organization_unit}\CN=${common_name}"
export days='36500'

export ca_key='ca.key'
export ca_crt='ca.crt'

export localhost_key='localhost.key'
export localhost_csr='localhost.csr'
export localhost_crt='localhost.crt'
export localhost_passphrase='CORS-proxy'
export localhost_extfile="${DIR}/../etc/extfile_localhost.txt"

cd "${DIR}/../.."
