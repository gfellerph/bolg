const opn = require('opn')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const config = require('./config');
const webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./back.prod.config')
  : require('./back.dev.config')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || 8081
// automatically open browser, if not set will be false
const { autoOpenBrowser } = config
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const { proxyTable } = config

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
})

// proxy api requests
Object.keys(proxyTable).forEach((context) => {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)
app.use(express.static('src/static'));

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
app.use(express.static('public', {
  extensions: 'html',
}));

const uri = `http://localhost:${port}`

let resolveReadyPromise
const readyPromise = new Promise((resolve) => {
  resolveReadyPromise = resolve
})

/* eslint no-console: 0 */
console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log(`> Listening at ${uri}\n`)
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  resolveReadyPromise()
})

const server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  },
}
