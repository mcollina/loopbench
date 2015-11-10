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
  var instance = loopbench()

  t.equal(instance.maxDelay, 42, 'default maxDelay matches')
  t.equal(instance.sampleInterval, 5, 'default sampleInterval matches')
  t.equal(instance.delay, 0, 'delay starts at zero')

  instance.sampleInterval = 1

  sleep(4)
  setImmediate(function () {
    console.log('delay', instance.delay)
    t.ok(instance.delay < 6, 'delay must be less than 6 ms')
    t.ok(instance.delay > -1, 'delay must be greater than -1 ms')
    instance.stop()
    t.end()
  })
})

test('emits a "max" event when the maxEventLoopDelay is reached', function (t) {
  t.plan(6)

  var instance = loopbench({
    sampleInterval: 1, // ms
    maxDelay: 10 // ms
  })

  t.equal(instance.maxDelay, 10, 'maxDelay matches')
  t.equal(instance.sampleInterval, 1, 'sampleInterval matches')

  t.equal(instance.delay, 0, 'delay starts at zero')

  instance.on('max', function () {
    console.log('delay', instance.delay)
    t.pass('max is emitted')
    t.ok(instance.delay > 10, 'delay must be greater than 10 ms')
  })

  setImmediate(function () {
    t.ok(instance.delay > 10, 'delay must be greater than 10 ms')
    instance.stop()
  })

  sleep(50)
})
