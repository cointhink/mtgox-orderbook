var util = require('util')
var events = require('events')
var crypto = require('crypto');
var uuid = require('node-uuid');

// choice of streaming interface
var stream = require('./stream-websocket.js')

// queue of open calls
var open_calls = {}

var Mtgox = function(){
  var that = this
  var message_count = 0
  this.coin_code = 'BTC'

  this.setup = function(creds) {
    if(creds){
      this.creds = creds
      this.signing = crypto.createHmac('sha512', new Buffer(creds.secret, 'base64'));
    }
    stream.setup()
    this._stream_hookup()
  }

  this.connect = function(currency){
    this.currency_code = currency.toUpperCase()
    stream.connect(this.currency_code)
  }

  this._stream_hookup = function(){
    stream.on('connect', function() {
      that.emit('connect')
    })
    stream.on('message', function(data){
      that.emit('message', message)
      that.event(message)
      message_count += 1
    })
    stream.on('close', function(){
      that.emit('disconnect')
    })
  }

  this._send = function(message){
    var msg = JSON.stringify(message)
    stream.send(message)
  }

  this.call = function(endpoint, params, cb){
    var id = uuid.v4().replace(/-/g,'')
    var call = {
      "id": id,
      "nonce": uuid.v4().replace(/-/g,''),
      "call": endpoint,
      "params": params,
      "item": this.coin_code,
      "currency": this.currency_code
    }

    var key_buf = new Buffer(this.creds.key.replace(/-/g,''), 'hex')
    var call_json_buf = new Buffer(JSON.stringify(call))
    var sig_buf = this.signing.update(call_json_buf).digest()
    var call_buf = Buffer.concat([key_buf, sig_buf, call_json_buf])
    var req = {
      "op": "call",
      "id": id,
      "call": call_buf.toString('base64'),
      "context": "mtgox.com"
    }
    that._send(req)
    open_calls[id] = {params: call, callback: cb}
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
    if(msg.id){
      var callback = open_calls[msg.id]
      if(callback){
        this._call_result(callback, msg)
      }
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

  this._call_result = function(call, msg){
    if(msg.success){
      call.callback(null, msg)
    } else {
      call.callback(msg, call.params)
    }
  }

  this._update_orderbook = function(depth){
  }

  this.disconnected = function(){}
}

util.inherits(Mtgox, events.EventEmitter);
module.exports = new Mtgox()
