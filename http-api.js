var request = require('request')

module.exports = {
  call: function(creds, method, params){
    var api_url = "https://mtgox.com/api/2/"
    console.log('call method '+method)
    var params = { method: 'post',
                   url: api_url+method,
                   headers: {'Rest-Key': creds.key,
                             'Rest-Sign':  ""}
                 }
    request.post(params)
  },
  nonce: function(){
    return Date.now()
  }
}