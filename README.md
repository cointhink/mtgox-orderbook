Signals for the Mt.Gox orderbook from the socket.io streaming API.

## Getting started
```
$ npm install mtgox-orderbook socket.io-client
$ cat > easyticker.js
var socketio = require('socket.io-client'),
    mtgox    = require('mtgox-orderbook')

var sockio = socketio.connect(mtgox.socketio_url)
var obook = mtgox.attach(sockio, 'usd')

obook.on('ticker', function(ticker){
  console.log("high: "+ticker.high.display_short+
              " low: "+ticker.low.display_short+
              " last: "+ticker.last.display_short)
})
$ node easyticker.js
high: $127.30 low: $115.20 last: $126.00
high: $127.30 low: $115.20 last: $126.78
high: $127.30 low: $115.20 last: $126.78
```

# Methods
* connect(socketio, 'usd')

Connect to MtGox using the socketio object. Listen to depth/trade/ticker messages for the given currency.

* subscribe(channel_name)

Issue a subscribe request for a channel. Currently supported is 'lag'. See example.js for usage.

# Signals

## socket.io signals

* on('connect')
* on('disconnect')

## mtgox signals
* on('subscribe', function(channel_name))
* on('unsubscribe', function(channel_name))
* on('remark', function(message))
* on('lag', function(lag_detail_object))
* on('trade', function(trade_detail_object))
* on('depth', function(depth_detail_object))
* on('ticker', function(ticker_detail_object))


See https://en.bitcoin.it/wiki/MtGox/API/Streaming for information about the detail objects.
