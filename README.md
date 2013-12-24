Signals for the Mt.Gox orderbook from the streaming API.

## Getting started
```
$ npm install mtgox-orderbook
$ cat > easyticker.js
var mtgox = require('mtgox-orderbook')

mtgox.setup('websocket') // optional credentials
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
* setup('websocket')

Connect to MtGox using the websockets API.

* setup('websocket', {key: "key123", secret: "secretdata=="})

Connect to MtGox using the websockets API. Store key and token for authenticated calls.

* setup('pubnub')

Connect to MtGox using the pubnub API. Public access only.

* connect('usd')

Connect to the streaming API for the bitcoin market denominated in US dollars.

* subscribe(channel_name)

Issue a subscribe request for a channel. Channel names are 'trades', 'ticker', 'depth', and 'lag'. See example.js for usage. Note websocket connections are auto-subscribed to 'depth' and 'ticker'

* call(method, params, callback)

Send a method call and params, encrypted with credentials, over the stream. 
Method names come from the HTTP v1 API. 
The result comes from the stream and is paired to the request, the passed to 
callback(error, result).
See example-auth.js for usage.

# Signals

## api maintenance signals

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
