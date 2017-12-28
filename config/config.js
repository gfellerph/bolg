module.exports = {
  proxyTable: {
    '/publish': { target: 'http://localhost:3000', secure: false },
    '/unpublish': { target: 'http://localhost:3000', secure: false },
    '/api': { target: 'http://localhost:3000', secure: false },
    '/socket.io': { target: 'ws://localhost:3000', secure: false, ws: true },
  },
  autoOpenBrowser: true,
}
