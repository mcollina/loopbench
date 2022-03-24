'use strict'

const EE = require('events').EventEmitter

const defaults = {
  limit: 42,
  sampleInterval: 5
}

function loopbench (opts) {
  opts = Object.assign({}, defaults, opts)

  const timer = setInterval(checkLoopDelay, opts.sampleInterval)
  timer.unref()

  const result = new EE()

  result.delay = 0
  result.sampleInterval = opts.sampleInterval
  result.limit = opts.limit
  result.stop = clearInterval.bind(null, timer)

  let last = now()

  return result

  function checkLoopDelay () {
    const toCheck = now()
    const overLimit = result.overLimit
    result.delay = Number(toCheck - last - BigInt(result.sampleInterval))
    last = toCheck

    result.overLimit = result.delay > result.limit

    if (overLimit && !result.overLimit) {
      result.emit('unload')
    } else if (!overLimit && result.overLimit) {
      result.emit('load')
    }
  }

  function now () {
    return process.hrtime.bigint() / 1000000n
  }
}

module.exports = loopbench
