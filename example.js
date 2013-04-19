var socketio = require('socket.io-client')
var mtgox = require('../mtgox-orderbook')

var obook = mtgox.connect(socketio, 'usd')

obook.on('connect', function(trade){
  console.log('connected to mtgox')
  // mtgox is happier if the lag subscribe comes a moment after connecting
  setTimeout(function(){obook.subscribe("lag")}, 1000)
})

obook.on('subscribe', function(channel_id){
  console.log('subscribed '+channel_id)
})

obook.on('lag', function(lag){
  console.log('lag! '+JSON.stringify(lag))
})

obook.on('trade', function(trade){
  console.log('trade! '+JSON.stringify(trade))
})

obook.on('depth', function(depth){
  console.log('depth! '+JSON.stringify(depth))
})

obook.on('ticker', function(ticker){
  console.log('ticker! '+JSON.stringify(ticker))
})