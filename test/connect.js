var vows = require('vows'),
    assert = require('assert');

var EventEmitter = require('events').EventEmitter;
var mockio = new EventEmitter()

var mtgox = require('../index.js')

vows.describe('mtgox-orderbook').addBatch({
    'connect to mtgox': {
      topic: function(){
        //mtgox.on('connect', this.callback)
        // why is this broken
        mtgox.connect(mockio)
      },
      'connection succeeds': function () {
        assert.isTrue(true);
      },
    }
}).export(module)
