const baseURL = 'https://player.twitch.tv/?channel=';
const qs = require('sdk/querystring');
const Request = require("sdk/request").Request;




module.exports = getTwitchUrl;

function getTwitchUrl(channelId, cb, time) {
  const params = qs.stringify({});

  cb(null, `http://player.twitch.tv/?channel=panky` );
}
