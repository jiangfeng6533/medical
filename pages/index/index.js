//index.js
var wxCharts = require('../../utils/wxcharts.js');
var global = require('../../Model/global.js');
//获取应用实例
const app = getApp()
var lineChart = null;
var startPos = null;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    motto: 'Hi 开发者！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function () {
    var that = this;
    global.http.nopostReq(
      global.Configs.getsickdata,
      { p_id: wx.getStorageSync("p_id") },
      function (ret) {
        if (ret.data.ret == 200) {
          console.log('sickdata', ret)
          var categories = [];
          var mordata = [];
          var lunchdata = [];
          var sleepdata = [];
          var sidata = ret.data.data;
          console.log('sidata',sidata);
          for (let k in sidata) { 
            categories.push('第' + (parseInt(k) + 1) + '天');
            mordata.push(sidata[k].xt_morning_before);
            lunchdata.push(sidata[k].xt_lunch_after);
            sleepdata.push(sidata[k].xt_sleep_before);
          }
          that.setData( {
            categories: categories,
            mordata: mordata,
            lunchdata: lunchdata,
            sleepdata: sleepdata,
            sidata: sidata

          });
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }

          // var categories = that.data.categories
          // var mordata = that.data.mordata
          // var sleepdata = that.data.sleepdata
          // var lunchdata = that.data.lunchdata
          console.log('categories', categories)
          lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '空腹',
              data: mordata,
              format: function (val, name) {
                console.log('va',val)
                return val;
              }
            }, {
              name: '餐后',
              data: lunchdata,
              format: function (val, name) {
                return val;
              }
            }, {
              name: '睡前',
              data: sleepdata,
              format: function (val, name) {
                return val;
              }
            }],
            xAxis: {
              disableGrid: false,
              gridColor: '#fff',
              fontColor: '#ccc'
            },
            yAxis: {
              title: '血糖数值 (mmol／L)',
              format: function (val) {
                return val.toFixed(2);
              },
              min: 6,
              gridColor: '#eee',
              fontColor: '#ccc',
              titleFontColor: '#ccc'
            },
            width: windowWidth,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
              lineStyle: 'curve'
            }
          });
        }
    });

    
  },
  onShow(){
    wx.setStorageSync('p_id', 1)
    // if (!wx.getStorageSync("p_id")) {
    //   wx.showModal({
    //     title: '账号未登录',
    //     content: '请登录或注册',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '../login/login',
    //         })
    //       }
    //     }
    //   });
    //   return;
    // }
  },
  onLoad: function (e) {
    if (!wx.getStorageSync("p_id")){
      return;
    }
    var that = this;
    that.createSimulationData();
    global.http.nopostReq(
      global.Configs.getuserinfo,
      { p_id: wx.getStorageSync("p_id") },
      function (data) {
        if (data.data.ret == 200) {
          console.log('carlong', data)
          that.setData({
            userinfo: data.data.data
          })
        }
      });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    

  },
  toman:function(){
 
    wx.navigateTo({
      url: '/pages/manger/sick',
    })
  }
})
