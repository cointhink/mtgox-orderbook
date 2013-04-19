var util = require('util')
var events = require('events')
var request = require('request')
var Seq = require('seq')

var Mtgox = function(){
  this.socket_url = "https://socketio.mtgox.com/mtgox"

  this.connect = function(socketio){
    var sockio = this.sockio = socketio.connect(this.socket_url)
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
      this.emit(msg.channel_name, msg[msg.private])
    }
  }

  this.disconnected = function(){}
}

util.inherits(Mtgox, events.EventEmitter);
module.exports = new Mtgox()
