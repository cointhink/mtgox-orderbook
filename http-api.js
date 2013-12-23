var request = require('request')

module.exports = {
  call: function(creds, method, coin, currency, params, cb){
    var api_url = "https://data.mtgox.com/api/2/"
    var url = api_url + coin + currency + "/" + method
    console.log('call method '+url)
    var params = { method: 'post',
                   url: url,
                   headers: {'Rest-Key': creds.key,
                             'Rest-Sign':  ""}
                 }
    request(params, cb)
  },

  nonce: function(){
    return Date.now()
  }
}