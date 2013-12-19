var util = require('util')
var events = require('events')

var StreamEcho = function(){
  var that = this

  this.setup = function(publish_key) {
  }

  this.connect = function(currency_code){
  }

  this.send = function(message){
  }
}

util.inherits(StreamEcho, events.EventEmitter);
module.exports = new StreamEcho()
