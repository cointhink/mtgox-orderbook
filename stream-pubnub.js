var util = require('util')
var events = require('events')
var pubnub = require('pubnub')

var StreamPubNub = function(){
  var that = this
  var mtgox_subscribe_key = "sub-c-50d56e1e-2fd9-11e3-a041-02ee2ddab7fe"

  var channels = { "depth.BTCUSD": "24e67e0d-1cad-4cc0-9e7a-f8523ef460fe",
                   "ticker.BTCUSD": "d5f06780-30a8-4a48-a2f8-7ed181b4a13f"
                 }

  this.setup = function(publish_key) {
    this.pubnub = pubnub.init({
      publish_key   : publish_key,
      subscribe_key : mtgox_subscribe_key
    });
  }

  this.connect = function(currency_code){
    var channel_name = 'ticker.BTC'+currency_code
    var channel = channels[channel_name]
    console.log('connecting pubnub '+channel_name)
    this.pubnub.subscribe({channel: channel, callback: this.cb})
  }

  this.cb = function(message){
    that.emit('message', message)
  }

  this.send = function(message){
    this.connection.sendUTF(message)
  }
}

util.inherits(StreamPubNub, events.EventEmitter);
module.exports = new StreamPubNub()
