var mtgox = require('../mtgox-orderbook')

mtgox.setup('websocket', {"key": "keyid-key",
                          "secret": "secretdata=="})

mtgox.on('connect', function(trade){
  console.log('connected to mtgox')
  mtgox.call('private/info', {}, function(error, result){
      if(error){ } else {
        console.log("This key is for login "+result.Login+" with rights: "+result.Rights)
      }
    })
})

mtgox.on('remark', function(remark){
  console.log('remark '+JSON.stringify(remark))
})

mtgox.connect('usd')
