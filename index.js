var util = require('util')
var events = require('events')
var crypto = require('crypto');
var WebSocketClient = require('websocket').client;
var uuid = require('node-uuid');

var open_calls = []

var Mtgox = function(){
  var that = this
  var message_count = 0
  this.ws_url = "ws://websocket.mtgox.com/mtgox"
  this.coin_code = 'BTC'

  this.setup = function(ws) {
    this.ws = ws || new WebSocketClient();
  }

  this.credentials = function(creds){
    this.creds = creds
    this.signing = crypto.createHmac('sha512', new Buffer(creds.secret, 'base64'));
  }

  this.connect = function(currency){
    if(typeof(this.ws) == 'undefined'){
      this.setup()
    }
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

  this.call = function(endpoint, params, cb){
    var id = uuid.v4()
    var call = {
      "id": id,
      "nonce": uuid.v4(),
      "call": endpoint,
      "params": params,
      "item": this.currency_code
    }

    var call_json = JSON.stringify(call)
    var signed_call = this.signing.update(call_json).digest('base64')
    var short_key = this.creds.key.replace('-','')

    var req = {
      "op": "call",
      "id": id,
      "call": short_key+signed_call+call_json,
      "context": "mtgox"
    }

    that._send(req)
    open_calls.push({id:id, cb:cb})
  }

  this.unsubscribe = function(channel){
    var channels = {
      'trades':'dbf1dee9-4f2e-4a08-8cb7-748919a71b21',
      'ticker':'d5f06780-30a8-4a48-a2f8-7ed181b4a13f',
      'depth':'24e67e0d-1cad-4cc0-9e7a-f8523ef460fe'
    }
    var channel = channels[channel.toLowerCase()]
    var unsubscribe_msg = {"op": "unsubscribe",
                           "channel": channel}
    that._send(unsubscribe_msg)
  }

  this.subscribe = function(channel){
    var subscribe_msg = {"op": "mtgox.subscribe",
                         "type": channel}
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
    if(msg.op == "result") {
      this._call_result(msg)
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

  this._call_result = function(msg){
  }

  this._update_orderbook = function(depth){

  }

  this.disconnected = function(){}
}

util.inherits(Mtgox, events.EventEmitter);
module.exports = new Mtgox()
