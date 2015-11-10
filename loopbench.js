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

  var result = new EE()

  result.delay = 0
  result.sampleInterval = opts.sampleInterval
  result.limit = opts.limit
  result.stop = clearInterval.bind(null, timer)

  var last = now()

  return result

  function checkLoopDelay () {
    var toCheck = now()
    result.delay = toCheck - last - result.sampleInterval
    last = toCheck

    if (result.delay > result.limit) {
      result.overLimit = true
      result.emit('load')
    } else {
      result.overLimit = false
    }
  }

  function now () {
    var ts = process.hrtime()
    return (ts[0] * 1e3) + (ts[1] / 1e6)
  }
}

module.exports = loopbench
