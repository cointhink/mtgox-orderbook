Signals for the Mt.Gox orderbook.

## trade


```
var socketio = require('socket.io-client')
var mtgox = require('mtgox-orderbook')

var obook = mtgox.connect(socketio, 'usd')

obook.on('trade', function(trade){ 
  console.log('trade! '+trade.amount)
})
```