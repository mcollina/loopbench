'use strict'

var xtend = require('xtend')
var EE = require('events').EventEmitter

var defaults = {
  limit: 42,
  sampleInterval: 5
}

function loopbench (opts) {
  opts = xtend(defaults, opts)

  var timer = setInterval(checkLoopDelay, opts.sampleInterval)
  timer.unref()

  var result = new EE()

  result.delay = 0
  result.sampleInterval = opts.sampleInterval
  result.limit = opts.limit
  result.stop = clearInterval.bind(null, timer)

  var last = now()

  return result

  function checkLoopDelay () {
    var toCheck = now()
    var overLimit = result.overLimit
    result.delay = toCheck - last - result.sampleInterval
    last = toCheck

    result.overLimit = result.delay > result.limit

    if (overLimit && !result.overLimit) {
      result.emit('unload')
    } else if (!overLimit && result.overLimit) {
      result.emit('load')
    }
  }

  function now () {
    var ts = process.hrtime()
    return (ts[0] * 1e3) + (ts[1] / 1e6)
  }
}

module.exports = loopbench
