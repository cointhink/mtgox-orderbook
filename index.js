var util = require('util')
var events = require('events')
var request = require('request')
var Seq = require('seq')

var Mtgox = function(){
  this.url = "https://socketio.mtgox.com/mtgox"
  this.connect = function(socketio, currency){
    var sockio = socketio.connect(this.url)
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
      //that.subscribe(sockio, that.channel_id[currency])
    })
    return this
  }
  
  this.subscribe = function(sockio, type){
    sockio.emit({  "op": "mtgox.subscribe",
                 "type": type})
  }
  
  this.connected = function(){console.log("internal connected")}
  
  this.event = function(msg){
    if(msg.op == "subscribe") {
      this.emit('subscribe', msg.channel)
    }
    if(msg.op == "private") {
      if(msg.private == "trade") {
        this.emit('trade', msg.trade)
      }
    }
  }
  
  this.disconnected = function(){console.log("internal disconnected")}
}

util.inherits(Mtgox, events.EventEmitter);
module.exports = new Mtgox()