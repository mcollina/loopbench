'use strict'

const http = require('http')
const server = http.createServer(serve)
const loopbench = require('./')()

loopbench.on('load', function () {
  console.log('max delay reached', loopbench.delay)
})

function sleep (msec) {
  let i = 0
  const start = Date.now()
  while (Date.now() - start < msec) { i++ }
  return i
}

function serve (req, res) {
  console.log('current delay', loopbench.delay)
  console.log('overLimit', loopbench.overLimit)

  if (loopbench.overLimit) {
    res.statusCode = 503 // Service Unavailable
    res.setHeader('Retry-After', 10)
  }

  res.end()
}

server.listen(0, function () {
  const req = http.get(server.address())

  req.on('response', function (res) {
    console.log('got status code', res.statusCode)
    console.log('retry after', res.headers['retry-after'])

    setTimeout(function () {
      console.log('overLimit after load', loopbench.overLimit)
      const req = http.get(server.address())

      req.on('response', function (res) {
        console.log('got status code', res.statusCode)

        loopbench.stop()
        server.close()
      }).end()
    }, parseInt(res.headers['retry-after'], 10))
  }).end()

  setImmediate(function () {
    console.log('delay after active sleeping', loopbench.delay)
  })

  sleep(500)
})
