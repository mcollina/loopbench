'use strict'

const test = require('tape')
const loopbench = require('./')

function sleep (msec) {
  const start = now()
  let i = 0
  while (now() - start < msec) {
    i++
  }

  // just to keep the event loop open
  setTimeout(function () {}, 50)
  return i
}

function now () {
  return process.hrtime.bigint() / 1000000n
}

test('bench the event loop', function (t) {
  const instance = loopbench()

  t.equal(instance.limit, 42, 'default limit matches')
  t.equal(instance.sampleInterval, 5, 'default sampleInterval matches')
  t.equal(instance.delay, 0, 'delay starts at zero')

  instance.sampleInterval = 1

  sleep(4)
  setImmediate(function () {
    console.log('delay', instance.delay)
    t.ok(instance.delay < 8, 'delay must be less than 8 ms')
    t.ok(instance.delay > -1, 'delay must be greater than -1 ms')
    t.notOk(instance.overLimit, 'must not be overLimit')
    instance.stop()
    t.end()
  })
})

test('emits a "load" event when the limit is reached', function (t) {
  t.plan(7)

  const instance = loopbench({
    sampleInterval: 1, // ms
    limit: 10 // ms
  })

  t.equal(instance.limit, 10, 'limit matches')
  t.equal(instance.sampleInterval, 1, 'sampleInterval matches')

  t.equal(instance.delay, 0, 'delay starts at zero')

  instance.on('load', function () {
    console.log('delay', instance.delay)
    t.pass('load is emitted')
    t.ok(instance.delay > 10, 'delay must be greater than 10 ms')
    t.ok(instance.overLimit, 'must be overLimit')

    setTimeout(function () {
      console.log('delay', instance.delay)
      t.notOk(instance.overLimit, 'overLimit returned to false')
      instance.stop()
    }, instance.sampleInterval * 10)
  })

  sleep(50)
})

test('emits a "unload" event when the loop goes under the limit', function (t) {
  t.plan(7)

  const instance = loopbench({
    sampleInterval: 1, // ms
    limit: 10 // ms
  })

  t.equal(instance.limit, 10, 'limit matches')
  t.equal(instance.sampleInterval, 1, 'sampleInterval matches')

  t.equal(instance.delay, 0, 'delay starts at zero')

  instance.once('load', function () {
    console.log('delay', instance.delay)
    t.pass('load is emitted')
    t.ok(instance.delay > 10, 'delay must be greater than 10 ms')
    t.ok(instance.overLimit, 'must be overLimit')

    instance.once('unload', function () {
      console.log('delay', instance.delay)
      t.notOk(instance.overLimit, 'overLimit returned to false')
      instance.stop()
    })
  })

  sleep(50)
})
