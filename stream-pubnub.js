var util = require('util')
var events = require('events')
var pubnub = require('pubnub')
var http_api = require('./http-api.js')

var StreamPubNub = function(){
  var that = this
  var mtgox_subscribe_key = "sub-c-50d56e1e-2fd9-11e3-a041-02ee2ddab7fe"

  var channels = { "depth.BTCUSD": "24e67e0d-1cad-4cc0-9e7a-f8523ef460fe",
                   "ticker.BTCUSD": "d5f06780-30a8-4a48-a2f8-7ed181b4a13f",
                   "trade.lag": "85174711-be64-4de1-b783-0628995d7914"
                 }

  this.setup = function(creds) {
    pubnub_params = {subscribe_key : mtgox_subscribe_key}
    if(creds){
      this.creds = creds
      pubnub_params.publish_key = creds.publish_key
    }
    this.pubnub = pubnub.init(pubnub_params)
  }

  this.connect = function(coin_code, currency_code){
    this.coin_code = coin_code
    this.currency_code = currency_code
    this.emit('connect')
  }

  this.subscribe = function(short_channel){
    var channel
    if(short_channel == 'lag') {
      channel = 'trade.lag'
    } else {
      channel = short_channel+'.'+this.currency_pair
    }
    this.pubnub.subscribe({channel: channels[channel], callback: this.cb})
  }

  this.cb = function(message){
    that.emit('message', message)
  }

  this.send = function(channel, message){
    this.pubnub.publish({
        channel : channel,
        message : message
    })
  }

  this.call = function(call){
    this.private_keys()
  }

  this.private_keys = function(){
    var method = "stream/private_get"
    http_api.call(this.creds, method, this.coin_code, this.currency_code, {},
      function(e,r,b){
        if(e){ console.err(b)} else {return r}
      }
    )
  }
}

util.inherits(StreamPubNub, events.EventEmitter);
module.exports = new StreamPubNub()
