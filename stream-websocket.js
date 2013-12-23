var util = require('util')
var crypto = require('crypto');
var events = require('events')
var WebSocketClient = require('websocket').client;

var StreamWebSocket = function(){
  var that = this
  var ws_url = "ws://websocket.mtgox.com/mtgox"

  this.setup = function(creds) {
    this.ws = new WebSocketClient();
    this.creds = creds
    this.hookup()
  }

  this.connect = function(coin_code, currency_code){
    this.currency_code = currency_code
    this.coin_code = coin_code
    var url = ws_url+'?Currency='+this.currency_code
    var context = "http://websocket.mtgox.com"
    this.ws.connect(url, null, context);
    // depth and ticker are auto-subscribed
  }

  this.subscribe = function(channel){
    var subscribe_msg = {"op": "mtgox.subscribe",
                         "type": channel}
    this.send(subscribe_msg)
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
    var msg = JSON.stringify(message)
    this.connection.sendUTF(msg)
  }

  this.call = function(call) {
    var key_buf = new Buffer(this.creds.key.replace(/-/g,''), 'hex')
    var call_json_buf = new Buffer(JSON.stringify(call))
    var signing = crypto.createHmac('sha512', new Buffer(this.creds.secret, 'base64'));
    var sig_buf = signing.update(call_json_buf).digest()
    var call_buf = Buffer.concat([key_buf, sig_buf, call_json_buf])
    var req = {
      "op": "call",
      "id": call.id,
      "call": call_buf.toString('base64'),
      "context": "mtgox.com"
    }
    this.send(req)
  }
}

util.inherits(StreamWebSocket, events.EventEmitter);
module.exports = new StreamWebSocket()
