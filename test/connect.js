var EventEmitter = require('events').EventEmitter;
var vows = require('vows'),
    assert = require('assert'),
    nodemock = require('nodemock');

var mtgox = require('../index.js')

var mockio = new EventEmitter()

vows.describe('mtgox-orderbook').addBatch({
    'connect to mtgox': {
      topic: function(){
        var that = this
        mtgox.on('connect', function(payload){
          // vowjs insists on first param error
          that.callback(null, payload)
        })
        mtgox.attach(mockio, 'usd')
        mockio.emit('connect')
      },
      'connection succeeds': function () {
        assert.isTrue(true);
      },
    },
    'subscribe message':{
      topic: function(){
        var that = this
        mtgox.on('subscribe', function(payload){
          that.callback(null, payload)
        })
        mockio.emit('message',
          { op: 'subscribe',
            channel: 'dbf1dee9-4f2e-4a08-8cb7-748919a71b21' })
      },
      'signal': function (channel) {
        assert.equal(channel, 'dbf1dee9-4f2e-4a08-8cb7-748919a71b21')
      }
    },
    'lag message':{
      topic: function(){
        var that = this
        mtgox.on('lag', function(payload){
          that.callback(null, payload)
        })
        mockio.emit('message',
          { channel: '85174711-be64-4de1-b783-0628995d7914',
            channel_name: 'trade.lag',
            op: 'private',
            origin: 'broadcast',
            private: 'lag',
            lag:
              { qid: '8fd6533c-d863-4218-bd04-859dae934f22',
                stamp: '1366665922761866',
                age: 1170860 } })
      },
      'signal': function (lag) {
        assert.equal(lag.stamp, '1366665922761866')
      }
    },
    'depth message':{
      topic: function(){
        var that = this
        mtgox.on('depth', function(payload){
          that.callback(null, payload)
        })
        mockio.emit('message',
          { channel: '24e67e0d-1cad-4cc0-9e7a-f8523ef460fe',
            channel_name: 'depth.BTCUSD',
            op: 'private',
            origin: 'broadcast',
            private: 'depth',
            depth:
             { price: '116.92',
               type: 2,
               type_str: 'bid',
               volume: '0',
               price_int: '11692000',
               volume_int: '0',
               item: 'BTC',
               currency: 'USD',
               now: '1366664736649566',
               total_volume_int: '199613915' } })
      },
      'signal': function (depth) {
        assert.equal(depth.price, '116.92')
      }
    }
}).export(module)
