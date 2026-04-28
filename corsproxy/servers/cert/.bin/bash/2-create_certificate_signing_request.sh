#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${DIR}/env.sh"

key_out="$localhost_key"
crt_out="$localhost_csr"
if [ -n "$key_out" -a -e "$key_out" ]; then
  rm "$key_out"
fi
if [ -n "$crt_out" -a -e "$crt_out" ]; then
  rm "$crt_out"
fi

openssl \
  req -nodes \
  -newkey 'RSA:2048' \
  -subj "$subj" \
  -keyout "$key_out" \
  -out "$crt_out" \
  -config "$openssl_config"
