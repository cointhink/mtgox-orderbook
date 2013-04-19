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

obook.on('trade.lag', function(trade){
  console.log('trade! '+JSON.stringify(trade))
})

obook.on('trade.BTC', function(trade){
  console.log('trade! '+JSON.stringify(trade))
})

obook.on('depth.BTCUSD', function(depth){
  console.log('depth! '+JSON.stringify(depth))
})

obook.on('ticker.BTCUSD', function(ticker){
  console.log('ticker! '+JSON.stringify(ticker))
})