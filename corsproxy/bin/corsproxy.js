#! /usr/bin/env node

const argv_vals = require('./lib/process_argv')

const use_tls = (argv_vals["--tls-cert"] && argv_vals["--tls-key"]) || argv_vals["--tls"]

const server = (use_tls)
  ? require('../servers/start_https')({
      port:     argv_vals["--port"],
      tls_cert: argv_vals["--tls-cert"],
      tls_key:  argv_vals["--tls-key"],
      tls_pass: argv_vals["--tls-pass"]
    })
  : require('../servers/start_http')({
      port:     argv_vals["--port"]
    })

const middleware = require('../proxy')({
  acl_ip:   argv_vals["--acl-ip"],
  api_keys: argv_vals["--api-keys"]
})

if (middleware.connection)
  server.on('connection', middleware.connection)

if (middleware.request)
  server.on('request', middleware.request)
