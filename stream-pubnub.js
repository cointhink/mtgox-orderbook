var util = require('util')
var events = require('events')
var pubnub = require('pubnub')

var StreamPubNub = function(){
  var that = this
  var mtgox_subscribe_key = "sub-c-50d56e1e-2fd9-11e3-a041-02ee2ddab7fe"

  this.setup = function(publish_key) {
    pubnub.init({
      publish_key   : publish_key,
      subscribe_key : mtgox_subscribe_key
    });
    this.hookup()
  }

  this.connect = function(currency_code){
    console.log('connecting')
    var url = ws_url+'?Currency='+this.currency_code
    var context = "http://websocket.mtgox.com"
    this.ws.connect(url, null, context);
  }

  this.hookup = function(){
    this.ws.on('connect', function(connection) {
      that.connection = connection
      that.emit('connect')
      connection.on('message', function(data){
        if (data.type === 'utf8') {
          message = JSON.parse(data.utf8Data)
          that.emit('message', message)
        }
      })
      connection.on('close', function(){
        that.emit('close')
      })
    })
  }

  this.send = function(message){
    this.connection.sendUTF(message)
  }
}

util.inherits(StreamPubNub, events.EventEmitter);
module.exports = new StreamPubNub()
