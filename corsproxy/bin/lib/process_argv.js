const process_argv = require('@warren-bank/node-process-argv')

const argv_flags = {
  "--help":                  {bool: true},
  "--version":               {bool: true},

  "--port":                  {num:  "int"},
  "--acl-ip":                {},
  "--api-keys":              {},

  "--req-insecure":          {bool: true},
  "--tls":                   {bool: true},
  "--tls-cert":              {file: "path-exists"},
  "--tls-key":               {file: "path-exists"},
  "--tls-pass":              {file: "path-exists"}
}

const argv_flag_aliases = {
  "--help":                  ["-h"],
  "--acl-ip":                ["--acl-whitelist"]
}

let argv_vals = {}

try {
  argv_vals = process_argv(argv_flags, argv_flag_aliases)
}
catch(e) {
  console.log('ERROR: ' + e.message)
  process.exit(1)
}

if (argv_vals["--help"]) {
  const help = require('./help')
  console.log(help)
  process.exit(0)
}

if (argv_vals["--version"]) {
  let data = require('../../../package.json')
  console.log(data.version)
  process.exit(0)
}

if (argv_vals["--acl-ip"]) {
  argv_vals["--acl-ip"] = argv_vals["--acl-ip"].trim().toLowerCase().split(/\s*,\s*/g)
}

if (argv_vals["--api-keys"]) {
  argv_vals["--api-keys"] = argv_vals["--api-keys"].trim().split(/\s*,\s*/g)
}

if (argv_vals["--req-insecure"]) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
}

module.exports = argv_vals
