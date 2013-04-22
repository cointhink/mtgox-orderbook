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
        mtgox.on('connect', this.callback)
        mtgox.connect(mocketio, 'usd')
        mockio.emit('connect')
      },
      'connection succeeds': function (err) {
        assert.isUndefined(err);
      },
    }
}).export(module)
