var util = require('util')
var events = require('events')
var WebSocketClient = require('websocket').client;

var Mtgox = function(){
  var that = this
  var message_count = 0
  this.ws_url = "ws://websocket.mtgox.com/mtgox"
  this.coin_code = 'BTC'

  this.connect = function(currency){
    this.ws = new WebSocketClient();
    this._ws_setup()
    this.currency_code = currency.toUpperCase()
    var url = this.ws_url+'?Currency='+this.currency_code
    this.ws.connect(url, null, "http://websocket.mtgox.com");
    return this
  }

  this._ws_setup = function(){
    that.ws.on('connect', function(connection) {
      that.connected(connection)
      that.emit('connect')

      connection.on('message', function(data){
        if (data.type === 'utf8') {
          message = JSON.parse(data.utf8Data)
          that.emit('message', message)
          that.event(message)
          message_count += 1
        }
      })

      connection.on('close', function(){
        that.emit('disconnect')
        that.disconnected()
      })
    })
  }

  this._send = function(message){
    that.connection.sendUTF(JSON.stringify(message))
  }

  this.subscribe = function(channel){
    var channels = {
      'trades':'dbf1dee9-4f2e-4a08-8cb7-748919a71b21',
      'ticker':'d5f06780-30a8-4a48-a2f8-7ed181b4a13f',
      'depth':'24e67e0d-1cad-4cc0-9e7a-f8523ef460fe'
    }
    var channel = channels[channel.toLowerCase()]
    var subscribe_msg = {"op": "subscribe",
                         "channel": channel}
    that._send(subscribe_msg)
  }

  this.connected = function(connection){ that.connection = connection }

  this.event = function(msg){
    if(msg.op == "subscribe") {
      this.emit('subscribe', msg.channel)
    }
    if(msg.op == "unsubscribe") {
      this.emit('unsubscribe', msg.channel)
    }
    if(msg.op == "remark") {
      this.emit('remark', msg.message)
    }
    if(msg.op == "private") {
      var parts = msg.channel_name.split('.')
      var channel_name = parts[0]
      var currency = parts[1]

      this._private_dispatch(channel_name, currency, msg[msg.private])
    }
  }

  this._private_dispatch = function(channel_name, currency, payload){
    if(currency == this.coin_code ||
       currency == this.coin_code+this.currency_code) {
      this.emit(channel_name, payload)
      if(channel_name == "depth"){
        this._update_orderbook(payload)
      }
    } else if (channel_name == "trade" && currency == "lag") {
      this.emit("lag", payload)
    }
  }

  this._update_orderbook = function(depth){

  }

  this.disconnected = function(){}
}

util.inherits(Mtgox, events.EventEmitter);
module.exports = new Mtgox()
