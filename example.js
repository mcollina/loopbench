'use strict'

var loopbench = require('./')()

loopbench.on('max', function () {
  console.log('max delay reached', loopbench.delay)
})

function sleep (msec) {
  var start = Date.now()
  while (Date.now() - start < msec) {}
}

setTimeout(function () {
  console.log('current delay', loopbench.delay)

  setImmediate(function () {
    console.log('delay after active sleeping', loopbench.delay)

    loopbench.stop()
  })

  sleep(500)
}, 5)
