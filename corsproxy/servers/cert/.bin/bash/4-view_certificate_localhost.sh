#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${DIR}/env.sh"

openssl \
  x509 \
  -in "$localhost_crt" \
  -text -noout
