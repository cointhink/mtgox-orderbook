var util = require('util')
var events = require('events')
var request = require('request')
var Seq = require('seq')

var Mtgox = function(){
  this.socket_url = "https://socketio.mtgox.com/mtgox"
  this.coin_code = "BTC"

  this.connect = function(socketio, currency_code){
    var sockio = this.sockio = socketio.connect(this.socket_url)
    this.currency_code = currency_code.toUpperCase()
    var that = this
    sockio.on('connect', function() {
      sockio.on('message', function(data){
        that.emit('event', data)
        that.event(data)
      });
      sockio.on('disconnect', function(){
        that.emit('disconnect')
        that.disconnected()
      });
      that.emit('connect')
      that.connected()
    })
    return this
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

      if(currency == this.coin_code ||
         currency == this.coin_code+this.currency_code) {
        this.emit(channel_name, msg[msg.private])
      } else if (msg.channel_name == "trade.lag") {
        this.emit("lag", msg[msg.private])
      }
    }
  }

  this.disconnected = function(){}
}

util.inherits(Mtgox, events.EventEmitter);
module.exports = new Mtgox()
