#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${DIR}/env.sh"

key_out=''
crt_out="$localhost_crt"
if [ -n "$key_out" -a -e "$key_out" ]; then
  rm "$key_out"
fi
if [ -n "$crt_out" -a -e "$crt_out" ]; then
  rm "$crt_out"
fi

openssl \
  x509 -req \
  -days "$days" \
  -CAcreateserial \
  -CAkey "$ca_key" \
  -CA "$ca_crt" \
  -in "$localhost_csr" \
  -out "$crt_out" \
  -passin "pass:${localhost_passphrase}" \
  -extfile "$localhost_extfile"
