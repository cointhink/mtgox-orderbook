var mtgox = require('../mtgox-orderbook')

mtgox.setup('websocket') // optional access credentials

mtgox.on('connect', function(trade){
  console.log('connected to mtgox')
  mtgox.subscribe('lag')
})

mtgox.on('subscribe', function(channel_id){
  console.log('subscribed '+channel_id)
})

mtgox.on('remark', function(remark){
  console.log('remark '+JSON.stringify(remark))
})

mtgox.on('lag', function(lag){
  console.log('lag! '+JSON.stringify(lag))
})

mtgox.on('trade', function(trade){
  console.log('trade! '+JSON.stringify(trade))
})

mtgox.on('depth', function(depth){
  console.log('depth! '+JSON.stringify(depth))
})

mtgox.on('ticker', function(ticker){
  console.log('ticker! '+JSON.stringify(ticker))
})

mtgox.connect('usd')
