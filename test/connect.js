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
        mtgox.setup('echo')
        mtgox.connect('usd')
        mtgox.stream.emit('connect')
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
        mtgox.stream.emit('message',
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
        mtgox.stream.emit('message',
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
        mtgox.stream.emit('message',
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
      },
      'ticker message':{
        topic: function(){
          var that = this
          mtgox.on('ticker', function(payload){
            that.callback(null, payload)
          })
          mtgox.stream.emit('message',
            { channel: 'd5f06780-30a8-4a48-a2f8-7ed181b4a13f',
              channel_name: 'ticker.BTCUSD',
              op: 'private',
              origin: 'broadcast',
              private: 'ticker',
              ticker:
               { high:
                  { value: '715.00000',
                    value_int: '71500000',
                    display: '$715.00000',
                    display_short: '$715.00',
                    currency: 'USD' },
                 low:
                  { value: '522.44000',
                    value_int: '52244000',
                    display: '$522.44000',
                    display_short: '$522.44',
                    currency: 'USD' },
                 avg:
                  { value: '626.68754',
                    value_int: '62668754',
                    display: '$626.68754',
                    display_short: '$626.69',
                    currency: 'USD' },
                 vwap:
                  { value: '631.47196',
                    value_int: '63147196',
                    display: '$631.47196',
                    display_short: '$631.47',
                    currency: 'USD' },
                 vol:
                  { value: '44547.39179112',
                    value_int: '4454739179112',
                    display: '44,547.39179112 BTC',
                    display_short: '44,547.39 BTC',
                    currency: 'BTC' },
                 last_local:
                  { value: '690.00000',
                    value_int: '69000000',
                    display: '$690.00000',
                    display_short: '$690.00',
                    currency: 'USD' },
                 last_orig:
                  { value: '690.00000',
                    value_int: '69000000',
                    display: '$690.00000',
                    display_short: '$690.00',
                    currency: 'USD' },
                 last_all:
                  { value: '690.00000',
                    value_int: '69000000',
                    display: '$690.00000',
                    display_short: '$690.00',
                    currency: 'USD' },
                 last:
                  { value: '690.00000',
                    value_int: '69000000',
                    display: '$690.00000',
                    display_short: '$690.00',
                    currency: 'USD' },
                 buy:
                  { value: '687.00000',
                    value_int: '68700000',
                    display: '$687.00000',
                    display_short: '$687.00',
                    currency: 'USD' },
                 sell:
                  { value: '690.00000',
                    value_int: '69000000',
                    display: '$690.00000',
                    display_short: '$690.00',
                    currency: 'USD' },
                 item: 'BTC',
                 now: '1387482265266026' },
              stamp: 1387482265266378 }
            )
        },
        'signal': function (ticker) {
          assert.equal(ticker.last.value, '690.00000')
        },
      }
    }
}).export(module)
