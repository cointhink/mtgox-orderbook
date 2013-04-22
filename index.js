var util = require('util')
var events = require('events')

var Mtgox = function(){
  this.socket_url = "https://socketio.mtgox.com/mtgox"
  this.coin_code = "BTC"

  this.connect = function(socketio, currency_code){
    var sockio = this.sockio = socketio.connect(this.socket_url)
    this.currency_code = currency_code.toUpperCase()
    this._socketio_setup(sockio)
    return this
  }

  this._socketio_setup = function(socketio){
    var that = this
    socketio.on('connect', function(){
      that.emit('connect')
      that.connected()
    })
    socketio.on('message', function(data){
      that.emit('event', data)
      that.event(data)
    })
    socketio.on('disconnect', function(){
      that.emit('disconnect')
      that.disconnected()
    })
  }

  this.subscribe = function(channel){
    var subscribe_msg = {"op": "mtgox.subscribe",
                         "type": channel}
    this.sockio.json.send(subscribe_msg)
  }

  this.connected = function(){}

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
      } else if (channel_name == "trade.lag") {
        this.emit("lag", payload)
      }
  }

  this._update_orderbook = function(depth){

  }

  this.disconnected = function(){}
}

util.inherits(Mtgox, events.EventEmitter);
module.exports = new Mtgox()
