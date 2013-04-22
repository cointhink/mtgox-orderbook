var EventEmitter = require('events').EventEmitter;
var vows = require('vows'),
    assert = require('assert'),
    nodemock = require('nodemock');

var mtgox = require('../index.js')

var mockio = new EventEmitter()
var mocketio = nodemock.mock("connect").takes(mtgox.socket_url).returns(mockio)

vows.describe('mtgox-orderbook').addBatch({
    'connect to mtgox': {
      topic: function(){
        var that = this
        mtgox.on('connect', function(payload){
          that.callback(null, payload)
        })
        mtgox.connect(mocketio, 'usd')
        mockio.emit('connect')
      },
      'connection succeeds': function () {
        assert.isTrue(true);
      },
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
