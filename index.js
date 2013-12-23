var util = require('util')
var events = require('events')
var uuid = require('node-uuid');

// choice of streaming interface
var stream_websocket = require('./stream-websocket.js')
var stream_pubnub = require('./stream-pubnub.js')
var stream_echo = require('./stream-echo.js')

// queue of open calls
var open_calls = {}

var Mtgox = function(){
  var that = this
  var message_count = 0
  this.coin_code = 'BTC'

  this.setup = function(api, creds) {
    if(api == "websocket") {
      this.stream = stream_websocket
    } else if(api == "pubnub"){
      this.stream = stream_pubnub
    } else if(api == "echo"){
      this.stream = stream_echo // unittests
    } else {
      console.error("Error: no mtgox api specified!")
    }
    this.stream.setup(creds)
    this._stream_hookup()
  }

  this.connect = function(currency){
    if(!this.stream) {
      this.setup('websocket') // compatibility
    }
    this.currency_code = currency.toUpperCase()
    this.stream.connect(this.coin_code, this.currency_code)
  }

  this._stream_hookup = function(){
    this.stream.on('connect', function() {
      that.emit('connect')
    })
    this.stream.on('message', function(message){
      that.emit('message', message)
      that.event(message)
      message_count += 1
    })
    this.stream.on('close', function(){
      that.emit('disconnect')
    })
  }

  this._send = function(message){
    this.stream.send(message)
  }

  this.call = function(endpoint, params, cb){
    var id = uuid.v4().replace(/-/g,'')
    var call = {
      "id": id,
      "nonce": Date.now()*1000000,
      "call": endpoint,
      "params": params,
      "item": this.coin_code,
      "currency": this.currency_code
    }
    this.stream.call(call)
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
    this.stream.subscribe(channel)
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
      this._private_dispatch(msg.private, msg[msg.private])
    }
    if(msg.id){
      var callback = open_calls[msg.id]
      if(callback){
        this._call_result(callback, msg)
      }
    }
  }

  this._private_dispatch = function(op, payload){
    if(op == "depth"){
      if(payload.currency == this.currency_code){
        this.emit(op, payload)
        this._update_orderbook(payload)
      }
    } else if (op == "ticker") {
      this.emit("ticker", payload)
    } else if (op == "lag") {
      this.emit("lag", payload)
    }
  }

  this._call_result = function(call, msg){
    if(msg.result){
      call.callback(null, msg.result)
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
