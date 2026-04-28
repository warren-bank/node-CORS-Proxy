const {request} = require('@warren-bank/node-request')

function validate_key(api_keys, req_url_params) {
  // no security
  if (!api_keys || !Array.isArray(api_keys) || !api_keys.length)
    return true

  const req_api_key = req_url_params.get('key')
  return api_keys.includes(req_api_key)
}

function setPreflightResponse(res, req) {
  const req_headers = !!req.headers ? {...req.headers} : {}
  const res_headers = {}
  setCorsHeaders(res_headers, req_headers['origin'])
  res.writeHead(200, res_headers)
  res.end()
}

// return: Promise that resolves after the response to a proxied request has been completely piped to the server response
function pipeProxyResponse(res, req, req_url_params) {
  return new Promise((resolve, reject) => {
    const url = req_url_params.get('url')
    if (!url) throw new Error('missing required parameter: url')

    const req_headers = !!req.headers ? {...req.headers} : {}
    setHeaderParamValue(req_headers, 'host:')
    setHeaders(req_headers, req_url_params, 'reqHeaders')

    const options = [url, {
      method:  (req.method || 'GET'),
      headers: req_headers
    }]
    const POST_data = req // stream.Readable
    const config    = {binary: true, stream: true, keepContentEncoding: true}

    request(options, POST_data, config)
    .then(({response}) => {
      const res_headers = !!response.headers ? {...response.headers} : {}
      setCorsHeaders(res_headers, req_headers['origin'])
      setHeaders(res_headers, req_url_params, 'resHeaders')

      res.writeHead(response.statusCode, res_headers)
      response.pipe(res)

      response.on('end', () => {
        resolve()
      })

      response.on('error', (error) => {
        reject(error)
      })
    })
    .catch(error => {
      reject(error)
    })
  })
}

function setHeaders(headers, req_url_params, param_name) {
  const param_values = req_url_params.getAll(param_name)

  while(param_values.length) {
    const param_value = param_values.shift()

    setHeaderParamValue(headers, param_value)
  }
}

function setHeaderParamValue(headers, param_value) {
  const split_index = param_value.indexOf(':')
  if (split_index < 0) return
  const header_name  = param_value.substring(0, split_index).trim().toLowerCase()
  const header_value = param_value.substring(split_index + 1, param_value.length).trim()
  if (!header_name) return
  if (!header_value) {
    if (!header_name.endsWith('*')) {
      delete headers[header_name]
    }
    else if (header_name.length === 1) {
      // param_value = "*:"
      for (const [entry_name, entry_value] of Object.entries(headers)) {
        delete headers[entry_name]
      }
    }
    else {
      // param_value = "${prefix}*:"
      const header_name_prefix = header_name.substring(0, header_name.length - 1)
      for (const [entry_name, entry_value] of Object.entries(headers)) {
        if (entry_name.toLowerCase().startsWith(header_name_prefix)) {
          delete headers[entry_name]
        }
      }
    }
  }
  else {
    headers[header_name] = header_value
  }
}

function setCorsHeaders(headers, origin) {
  headers['access-control-allow-origin']          = (origin || '*')
  headers['access-control-allow-methods']         = '*'
  headers['access-control-allow-headers']         = '*'
  headers['access-control-allow-credentials']     = 'true'
  headers['access-control-allow-private-network'] = 'true'
  headers['access-control-max-age']               = '86400'
}

module.exports = {
  validate_key,
  setPreflightResponse,
  pipeProxyResponse
}
