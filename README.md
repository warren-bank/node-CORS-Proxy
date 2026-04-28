### [`corsproxy`](https://github.com/warren-bank/node-CORS-Proxy)

[Node.js]((https://nodejs.org/)) server that is [corsproxy.io](https://corsproxy.io/) API compatible&hellip; can be used as a self-hosted drop-in replacement.
* supports per-request [header overrides](https://corsproxy.io/docs/header-rewrites/) via query parameters
* supports restricting access to requests that include an [API key](https://corsproxy.io/docs/get-api-key/)

- - - -

### Installation and Usage: Globally

#### How to: Install:

```bash
npm install --global "@warren-bank/corsproxy"
```

#### How to: Run the server(s):

```bash
corsproxy <options>

options:
========
--help
--version
--port <number>
--acl-ip <ip_address_list>
--api-keys <key_list>
--req-insecure
--tls
--tls-cert <filepath>
--tls-key <filepath>
--tls-pass <filepath>
```

#### Options:

* _--port_ is the port number that the server listens on
  * ex: `8080`
  * when this option is not specified:
    * HTTP proxy binds to: `80`
    * HTTPS proxy binds to: `443`
* _--acl-ip_ restricts proxy server access to clients at IP addresses in whitelist
  * ex: `"192.168.1.100,192.168.1.101,192.168.1.102"`
* _--api-keys_ restricts proxy server access to requests that include a `key` querystring parameter having a value in whitelist
  * ex: `"1111,2222,3333,4444,5555"`
* _--req-insecure_ is a flag to override the following environment variable to disable certificate validation for secure __https__ requests:
  * [`NODE_TLS_REJECT_UNAUTHORIZED`](https://nodejs.org/api/cli.html#cli_node_tls_reject_unauthorized_value)`= 0`
    * equivalent to:
      * `curl --insecure`
      * `wget --no-check-certificate`
* _--tls_ is a flag to start HTTP**S** proxy, rather than HTTP
  * used as shorthand to automatically configure the following options:
    * _--tls-cert_
    * _--tls-key_
    * _--tls-pass_
  * the values assigned to these options enable the use of a self-signed security certificate that is included in both the git repo and npm package, within the directory:
    * [`./corsproxy/servers/cert`](./corsproxy/servers/cert/)
* _--tls-cert_ is the filepath to a security certificate to use for HTTPS
* _--tls-key_ is the filepath to the private key for the _--tls-cert_ security certificate
* _--tls-pass_ is the filepath to a text file containing the security passphrase for the _--tls-key_ private key
  * optional, not required when the _--tls-key_ private key was created without a security passphrase

#### Examples:

1. print help<br>
  `corsproxy --help`

2. print version<br>
  `corsproxy --version`

3. start HTTP proxy at default port<br>
  `corsproxy`

4. start HTTP proxy at specific port<br>
  `corsproxy --port "8080"`

5. start HTTPS proxy at default port<br>
  `corsproxy --tls`

6. start HTTPS proxy at specific port<br>
  `corsproxy --tls --port "8081"`

- - - -

### Installation and Usage: Working with a Local `git` Repo

#### How to: Install:

```bash
git clone "https://github.com/warren-bank/node-CORS-Proxy.git"
cd "node-CORS-Proxy"
npm install
```

#### How to: Run the server(s):

```bash
# ----------------------------------------------------------------------
# If using a port number >= 1024 on Linux, or
# If using Windows:
# ----------------------------------------------------------------------
npm start [-- <options>]

# ----------------------------------------------------------------------
# https://www.w3.org/Daemon/User/Installation/PrivilegedPorts.html
#
# Linux considers port numbers < 1024 to be privileged.
# Use "sudo":
# ----------------------------------------------------------------------
npm run sudo [-- <options>]
```

#### Options:

* identical to the [command-line binary](#installation-and-usage-globally)

#### Examples:

1. print help<br>
  `npm start -- --help`

2. start HTTP proxy at specific port<br>
  `npm start -- --port "8080"`

3. start HTTPS proxy at specific port<br>
  `npm start -- --port "8081" --tls`

4. start HTTPS proxy at privileged port<br>
  `npm run sudo -- --port "443" --tls`

- - - -

### Client Usage

#### Web Browser Configuration:

* for HTTP proxy:
  - by default, secure webpages cannot make requests to a non-secure server (ie: the HTTP proxy)
  - the following are instructions for Chromium browsers to allow all pages to access the HTTP proxy (ex: `http://localhost:8080`)
    1. _Insecure origins treated as secure_
       * open: `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
       * enter: `http://localhost:8080`
       * set: `Enabled`
    2. [Chromium 100+] _Block insecure private network requests_
       * open: `chrome://flags/#block-insecure-private-network-requests`
       * set: `Disabled`
    3. restart Chrome
* for HTTPS proxy:
  - by default, the self-signed certificate used by the `--tls` option is untrusted
  - on Chromium browsers:
    * [Chrome will add custom root certificates from the certificates used by your computer's operating system.](https://support.google.com/chrome/answer/95617#root_store)
    * to open the root certificate management tool for your specific OS:
      - open: `Settings` &gt; `Privacy and security` &gt; `Security` &gt; `Advanced`
      - click: `Manage device certificates`
  - on Windows OS:
    * open the root certificate management tool
      - press: `Win + R`
      - enter: `certmgr.msc`
    * import the private certificate authority used to self-sign the server certificate
      - right-click on: `Trusted Root Certificate Authorities` &gt; `Certificates`
      - click: `All Tasks` &gt; `Import..`
      - click: `Next`
      - browse:
        * set file filter: `X.509 Certificate (*.cer,*.crt)`
        * select file: [`./corsproxy/servers/cert/ca.crt`](./corsproxy/servers/cert/ca.crt)
        * click: `Open`
      - click: `Next`
      - click: `Next`
      - click: `Finish`
      - click: `Yes`
    * confirmation:
      - click on: `Trusted Root Certificate Authorities` &gt; `Certificates`
      - find:
        * _Issued To_: `CORS-proxy`
        * _Issued By_: `CORS-proxy`
    * test:
      - open in Chromium: [`https://localhost:8081`](https://localhost:8081)

#### Example for HTTP proxy:

1. start local `corsproxy` server:
   ```bash
     # npm start -- --port "8080" --api-keys "my-password" --req-insecure
     corsproxy --port "8080" --api-keys "my-password" --req-insecure
   ```

2. run in web browser JS console on any page:
   ```javascript
     const api_url     = 'http://localhost:8080/'
     const api_key     = 'my-password'
     const req_url     = 'https://httpbin.org/anything'
     const req_headers = [{name: 'x-foo', value: 'req-foo'},{name: 'x-bar', value: 'req-bar'}]
     const res_headers = [{name: 'x-foo', value: 'res-foo'},{name: 'x-bar', value: 'res-bar'}]

     const qs_params = [`url=${encodeURIComponent(req_url)}`]
     if (api_key)
       qs_params.push(`key=${encodeURIComponent(api_key)}`)
     for(const {name: header_name, value: header_value} of req_headers) {
       qs_params.push(`reqHeaders=${encodeURIComponent(`${header_name}:${header_value || ''}`)}`)
     }
     for(const {name: header_name, value: header_value} of res_headers) {
       qs_params.push(`resHeaders=${encodeURIComponent(`${header_name}:${header_value || ''}`)}`)
     }

     let corsproxy_url = api_url || 'https://corsproxy.io/'
     corsproxy_url += '?' + qs_params.join('&')

     console.log(corsproxy_url)
     // http://localhost:8080/?url=https%3A%2F%2Fhttpbin.org%2Fanything&key=my-password&reqHeaders=x-foo%3Areq-foo&reqHeaders=x-bar%3Areq-bar&resHeaders=x-foo%3Ares-foo&resHeaders=x-bar%3Ares-bar

     fetch(corsproxy_url, {method: 'GET'})
       .then(res => res.json()).then(console.log)

     fetch(corsproxy_url, {method: 'POST', body: '{"hello": "world"}', headers: {'content-type': 'application/json'}})
       .then(res => res.json()).then(console.log)
   ```

#### Example for HTTPS proxy:

1. start local `corsproxy` server:
   ```bash
     # npm start -- --port "8081" --tls --api-keys "my-password" --req-insecure
     corsproxy --port "8081" --tls --api-keys "my-password" --req-insecure
   ```

2. run in web browser JS console on any page:
   ```javascript
     const api_url     = 'https://localhost:8081/'
     const api_key     = 'my-password'
     const req_url     = 'https://httpbin.org/anything'
     const req_headers = [{name: 'x-foo', value: 'req-foo'},{name: 'x-bar', value: 'req-bar'}]
     const res_headers = [{name: 'x-foo', value: 'res-foo'},{name: 'x-bar', value: 'res-bar'}]

     const qs_params = [`url=${encodeURIComponent(req_url)}`]
     if (api_key)
       qs_params.push(`key=${encodeURIComponent(api_key)}`)
     for(const {name: header_name, value: header_value} of req_headers) {
       qs_params.push(`reqHeaders=${encodeURIComponent(`${header_name}:${header_value || ''}`)}`)
     }
     for(const {name: header_name, value: header_value} of res_headers) {
       qs_params.push(`resHeaders=${encodeURIComponent(`${header_name}:${header_value || ''}`)}`)
     }

     let corsproxy_url = api_url || 'https://corsproxy.io/'
     corsproxy_url += '?' + qs_params.join('&')

     console.log(corsproxy_url)
     // https://localhost:8081/?url=https%3A%2F%2Fhttpbin.org%2Fanything&key=my-password&reqHeaders=x-foo%3Areq-foo&reqHeaders=x-bar%3Areq-bar&resHeaders=x-foo%3Ares-foo&resHeaders=x-bar%3Ares-bar

     fetch(corsproxy_url, {method: 'GET'})
       .then(res => res.json()).then(console.log)

     fetch(corsproxy_url, {method: 'POST', body: '{"hello": "world"}', headers: {'content-type': 'application/json'}})
       .then(res => res.json()).then(console.log)
   ```

- - - -

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
