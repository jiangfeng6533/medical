// pages/login/login.js
var global = require('../../Model/global.js');
var app =getApp();
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
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail(err) {
        console.log(err);
      }
    })
    if ( wx.getStorageSync("p_id")) {
      wx.showModal({
        title: '已登录',
        content: '您的账号已经登录',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../index/index',
            })
          }
        }
      });
      return;
    }
    wx.hideLoading();
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;

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
  getPhoneNumber(e) {
    console.log('getuser')
    var that = this;
    console.log(that.data.latitude);
    console.log(that.data.longitude);
    if (wx.getStorageSync("p_id")) {
      wx.showModal({
        title: '已登录',
        content: '您的账号已经登录',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../index/index',
            })
          }
        }
      });
      return;
    }
    if (that.data.latitude && that.data.longitude) {

    } else {
      wx.showModal({
        title: '亲请重新获取',
        content: '请先获取地理位置',
        showCancel: false
      })
      console.log('请先获取地理位置');
      return
    }
    wx.login({
      success: function (res) {
        var code = res.code;
        global.http.postReq(
          global.Configs.login,
          {
            code: code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            long: that.data.longitude,
            lat: that.data.latitude
          },
          function (val) {
            var data = val.data;
            console.log(data);
            if (data.code == 500) {
              wx.showModal({
                title: '亲请重新获取',
                content: data.msg,
                showCancel: false
              })
            }
            
            if (data.code == 200) {
              console.log('成功');
              that.setData({
                openid: data.openid,
                sessionKey: data.session_key,
                number: data.phoneNumber
              });
              if (data.p_id == 0 && data.p_id == '0'){
                wx.showModal({
                  title: '登录失败',
                  content: '账号异常请联系管理员！',
                  showCancel: false,
                  success(res) {
                    
                  }
                });
                return;
              }
              wx.setStorageSync('openid', data.openid);
              wx.setStorageSync('sessionKey', data.session_key);
              wx.setStorageSync('phone', data.phoneNumber);
              wx.setStorageSync('token', data.token);
              wx.setStorageSync('p_id', data.p_id);
              wx.setStorageSync('user_info', data.user_info);
              if (wx.getStorageSync("token")) {
                wx.showModal({
                  title: '登录成功',
                  content: '亲，等您好久啦！',
                  showCancel: false,
                  success(res) {
                    app.setPidToken(data.p_id, data.token);
                    wx.navigateBack({
                      delta: -1
                    });
                  }
                });
                return;
              }
            }
          }
        )
      }
    })

  }

})