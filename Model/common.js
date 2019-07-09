var utilMd5 = require('./md5.js');
var html=function(obj){
  this.rootDocment = obj.url,
  this.header = {
      'Accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': null,
  },
    this.getReq = function (url, data, cb){
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: this.rootDocment + url,
      method: 'get',
      data: data,
      header: this.header,
      success: function (res) {
        wx.hideLoading();
        return typeof cb == "function" && cb(res)
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        return typeof cb == "function" && cb(false)
      }
    })
  },
    this.postReq = function (url,data,cb){
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.rootDocment + url,
        header: this.header,
        data: data,
        method: 'post',
        success: function (res) {
          wx.hideLoading();
          return typeof cb == "function" && cb(res)
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: '网络错误',
            content: '网络出错，请刷新重试',
            showCancel: false
          })
          return typeof cb == "function" && cb(false)
        }
      })
    },
    this.nopostReq = function (url, data, cb) {
    
      wx.request({
        url: this.rootDocment + url,
        header: this.header,
        data: data,
        method: 'post',
        success: function (res) {
          return typeof cb == "function" && cb(res)
        },
        fail: function () {
          wx.showModal({
            title: '网络错误',
            content: '网络出错，请刷新重试',
            showCancel: false
          })
          return typeof cb == "function" && cb(false)
        }
      })
    }
	this.chintoken = function (token, strFinal = 'sx54dx95df1lj1cq'){
	  var md5StrFinal = utilMd5.hexMD5(strFinal);
	  var md5StrFinalArr = md5StrFinal.split('');
	  var str = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
	  var strArr = str.split('');
	  var md5Token = utilMd5.hexMD5(token);
	  var md5TokenArr = md5Token.split('');
	  var end = "";
	  for(var i=0;i<16;i++){
		var index = Math.floor(Math.random() * (31 - 0)) + 0;
		md5TokenArr[index] = md5StrFinalArr[index];
		end += strArr[index];
	  }
	  md5Token = md5TokenArr.join('');
	  return md5Token+end;
	}
  
}
//最后别忘了抛出来 

module.exports = {
  html: html,
  utilMd5: utilMd5
}