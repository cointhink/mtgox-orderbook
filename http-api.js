var request = require('request')
var urlUtil = require('url')
var crypto = require('crypto')

module.exports = {
  call: function(creds, method, coin, currency, params, cb){
    var api_url = "https://data.mtgox.com/api/2/"
    var path = coin + currency + "/" + method
    var url = api_url + path
    params.nonce = this.nonce()
    var postData = urlUtil.format({query:params}).substr(1)
    var message = path + "\0" + postData
    var signing = crypto.createHmac('sha512', new Buffer(creds.secret, 'base64'));
    signing.update(message)
    var params = { method: 'post',
                   url: url,
                   headers: {'Rest-Key': creds.key,
                             'Rest-Sign': signing.digest('base64'),
                             'Content-type': 'application/x-www-form-urlencoded'},
                   body: postData
                 }
    request(params, cb)
  },

  nonce: function(){
    return Date.now()*1000000
  }
}