const app = getApp();
const Config = require('./config.js');
const httpserver = require('./common.js');




var http = new httpserver.html({ url: Config.Config.rootDocment });

function calling(phone) {
  wx.makePhoneCall({
    phoneNumber: phone, //此号码并非真实电话号码，仅用于测试
    success: function () {
      console.log("拨打电话成功！")
    },
    fail: function () {
      console.log("拨打电话失败！")
    }
  })
}



module.exports = {
  http: http,
  Configs: Config.Config,
  calling: calling,
  
}