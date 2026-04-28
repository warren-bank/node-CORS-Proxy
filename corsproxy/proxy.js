const {URL} = require('node:url')
const {validate_key, setPreflightResponse, pipeProxyResponse} = require('./utils')

const get_middleware = function(params) {
  const {acl_ip, api_keys} = params

  const middleware = {}

  // Access Control
  if (acl_ip && Array.isArray(acl_ip) && acl_ip.length) {
    middleware.connection = (socket) => {
      if (socket && socket.remoteAddress) {
        const remote_ip = socket.remoteAddress.toLowerCase().replace(/^::?ffff:/, '')

        if (acl_ip.indexOf(remote_ip) === -1) {
          socket.destroy()
          console.log(socket.remoteFamily, 'connection blocked by ACL IP whitelist:', remote_ip)
        }
      }
    }
  }

  // Create an HTTP tunneling proxy
  middleware.request = async (req, res) => {
    try {
      const req_url_params = (new URL('http://localhost' + req.url)).searchParams

      if (!validate_key(api_keys, req_url_params)) {
        res.writeHead(401) // Unauthorized
        res.end()
        console.log('request blocked by API key:', req.url)
        return
      }

      if (req.method && (req.method.toUpperCase() === 'OPTIONS')) {
        setPreflightResponse(res, req)
        return
      }

      await pipeProxyResponse(res, req, req_url_params)
    }
    catch(error) {
      if (!res.headersSent) {
        res.writeHead(400) // Bad Request
      }
      if (!res.writableEnded) {
        res.end()
      }
      console.error('error proxying request:', req.url, error)
    }
  }

  return middleware
}

module.exports = get_middleware
