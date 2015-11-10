'use strict'

var test = require('tape')
var loopbench = require('./')

function sleep (msec) {
  var start = now()
  while (now() - start < msec) {}
}

function now () {
  var ts = process.hrtime()
  return (ts[0] * 1e3) + (ts[1] / 1e6)
}

test('bench the event loop', function (t) {
  var instance = loopbench({
    sampleInterval: 1 // ms
  })

  t.equal(instance.eventLoopDelay, 0, 'eventLoopDelay starts at zero')

  sleep(4)
  setImmediate(function () {
    console.log('delay', instance.eventLoopDelay)
    t.ok(instance.eventLoopDelay < 6, 'eventLoopDelay must be less than 6 ms')
    t.ok(instance.eventLoopDelay > -1, 'eventLoopDelay must be greater than -1 ms')
    instance.stop()
    t.end()
  })
})

test('emits a "max" event when the maxEventLoopDelay is reached', function (t) {
  t.plan(4)

  var instance = loopbench({
    sampleInterval: 1, // ms
    maxEventLoopDelay: 10 // ms
  })

  t.equal(instance.eventLoopDelay, 0, 'eventLoopDelay starts at zero')

  instance.on('max', function () {
    console.log('delay', instance.eventLoopDelay)
    t.pass('max is emitted')
    t.ok(instance.eventLoopDelay > 10, 'eventLoopDelay must be greater than 10 ms')
  })

  setImmediate(function () {
    t.ok(instance.eventLoopDelay > 10, 'eventLoopDelay must be greater than 10 ms')
    instance.stop()
  })

  sleep(50)
})
