# loopbench

[![Build Status](https://travis-ci.org/mqttjs/MQTT.js.svg)](https://travis-ci.org/mqttjs/MQTT.js)

Benchmark your event loop, extracted from [hapi](http://npm.im/hapi),
[hoek](http://npm.im/hoek), [heavy](http://npm.im/heavy) and
[boom](http://npm.im/boom).

* [Install](#install)
* [Example](#example)
* [API](#api)
* [Acknowledgements](#acknowledgements)
* [License](#license)

<a name="install"></a>
## Install
To install loopbench, simply use npm:

```
npm i loopbench --save
```

<a name="example"></a>
## Example

See [example.js][example].

<a name="api"></a>
## API

  * <a href="#constructor"><code><b>loopbench()</b></code></a>
  * <a href="#delay"><code>instance.<b>delay</b></code></a>
  * <a href="#limit"><code>instance.<b>limit</b></code></a>
  * <a href="#overLimit"><code>instance.<b>overLimit</b></code></a>
  * <a href="#stop"><code>instance.<b>stop()</b></code></a>

-------------------------------------------------------
<a name="constructor"></a>
### loopbench([opts])

Creates a new instance of loopbench.

Options:

* `sampleInterval`: the interval at which the eventLoop should be
  sampled, defaults to `5`.
* `limit`: the maximum amount of delay that is tollerated before
  [`overLimit`](#overLimit) becomes true, and the `load` event is
  emitted, defaults to `42`.

Events:

* `load`, emitted when `instance.delay > instance.limit`
* `unload`, emitted when `overLimit` goes from `true` and `false`

-------------------------------------------------------
<a name="delay"></a>
### instance.delay

The delay in milliseconds (and fractions) from the expected run.
It might be negative (in older nodes).

-------------------------------------------------------
<a name="limit"></a>
### instance.limit

The maximum amount of delay that is tollerated before
[`overLimit`](#overlimit) becomes true, and the `load` event is
emitted.

-------------------------------------------------------
<a name="overLimit"></a>
### instance.overLimit

Is `true` if the `instance.delay > instance.limit`.

-------------------------------------------------------
<a name="stop"></a>
### instance.stop()

Stops the sampling.

<a name="license"></a>
## License

Copyright Matteo Collina 2015, Licensed under [MIT][].

[MIT]: ./LICENSE
[example]: ./example.js
