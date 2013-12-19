var util = require('util')
var events = require('events')
var WebSocketClient = require('websocket').client;

var StreamWebSocket = function(){
  var that = this
  var ws_url = "ws://websocket.mtgox.com/mtgox"

  this.setup = function(creds) {
    this.ws = new WebSocketClient();
    if(creds){
      this.creds = creds
      this.signing = crypto.createHmac('sha512', new Buffer(creds.secret, 'base64'));
    }
    this.hookup()
  }

  this.connect = function(currency_code){
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

util.inherits(StreamWebSocket, events.EventEmitter);
module.exports = new StreamWebSocket()
