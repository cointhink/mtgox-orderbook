Signals for the Mt.Gox orderbook from the streaming API.

## Getting started
```
$ npm install mtgox-orderbook
$ cat > easyticker.js
var mtgox    = require('mtgox-orderbook')

mtgox.on('ticker', function(ticker){
  console.log("high: "+ticker.high.display_short+
              " low: "+ticker.low.display_short+
              " last: "+ticker.last.display_short)
})

mtgox.connect('usd')

$ node easyticker.js
high: $127.30 low: $115.20 last: $126.00
high: $127.30 low: $115.20 last: $126.78
high: $127.30 low: $115.20 last: $126.78
```

# Methods
* connect('usd')

Connect to MtGox using websockets. Listen to depth/trade/ticker messages for BTC, listed in USD.

* subscribe(channel_name)

Issue a subscribe request for a channel. Currently supported is 'trades', 'ticker' and
'depth'. See example.js for usage.

# Signals

## websocket signals

* on('connect', function())
* on('disconnect', function())

## mtgox signals
* on('subscribe', function(channel_name))
* on('unsubscribe', function(channel_name))
* on('remark', function(message))
* on('lag', function(lag_detail_object))
* on('trade', function(trade_detail_object))
* on('depth', function(depth_detail_object))
* on('ticker', function(ticker_detail_object))


See https://en.bitcoin.it/wiki/MtGox/API/Streaming for information about the detail objects.
