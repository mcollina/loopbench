'use strict'

var xtend = require('xtend')
var EE = require('events').EventEmitter

var defaults = {
  maxEventLoopDelay: 42,
  sampleInterval: 5
}

function loopbench (opts) {
  opts = xtend(opts, defaults)

  var sampleInterval = opts.sampleInterval
  var maxEventLoopDelay = opts.maxEventLoopDelay

  var timer = setInterval(checkLoopDelay, opts.sampleInterval)

  var result = new EE()
  result.eventLoopDelay = 0
  result.stop = clearInterval.bind(null, timer)

  var last = now()

  return result

  function checkLoopDelay () {
    var toCheck = now()
    result.eventLoopDelay = toCheck - last - sampleInterval
    last = toCheck

    if (result.eventLoopDelay > maxEventLoopDelay) {
      result.emit('max')
    }
  }

  function now () {
    var ts = process.hrtime()
    return (ts[0] * 1e3) + (ts[1] / 1e6)
  }
}

module.exports = loopbench
