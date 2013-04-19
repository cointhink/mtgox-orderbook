Signals for the Mt.Gox orderbook.

## Getting started
```
$ npm install mtgox-orderbook socket.io-client
$ cat > easyticker.js
var socketio = require('socket.io-client')
var mtgox = require('mtgox-orderbook')

var obook = mtgox.connect(socketio, 'usd')

obook.on('ticker', function(ticker){
  console.log("high: "+ticker.high.display+
              " low: "+ticker.low.display)
})
$ node easyticker.js
high: $136.43210 low: $95.00000
high: $136.43 low: $95.00
high: $136.43210 low: $95.00000
```

# Signals

Use on('signalname', function) to define a callback for each of the available signals.

## socket.io signals

* connect
* disconnect


## mtgox signals
* on('subscribe', function(channel_name))
* on('unsubscribe', function(channel_name))
* on('remark', function(message))
* on('lag', function(lag_detail_object))
* on('trade', function(trade_detail_object))
* on('depth', function(depth_detail_object))
* on('ticker', function(ticker_detail_object))


See https://en.bitcoin.it/wiki/MtGox/API/Streaming for information about the detail objects.
