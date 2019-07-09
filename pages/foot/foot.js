// pages/foot/foot.js
var app = getApp();
var global = require('../../Model/global.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    //获取专车订单状态
    global.http.nopostReq(
      global.Configs.getfoot,
      { pid: '' },
      function (data) {
        if(data.data.ret == 200){
          console.log('carlong', data)
          that.setData({
            footcontent: data.data.data
          })
          var article = data.data.data.content;
          WxParse.wxParse('article', 'html', article, that, 5);
        }
      });
    
    
  },
  toback: function () {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})