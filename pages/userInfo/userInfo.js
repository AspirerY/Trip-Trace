const app = getApp();
const util = require('../../utils/util.js');

// 引入腾讯地图AOI
var QQMapWX = require('../../libs/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
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

    qqmapsdk = new QQMapWX({
      key: '5WEBZ-JNRCJ-TM7FP-FIL4Y-KLTO6-V6FLS'
    });
  },
  checkMyTrack: function() {
    var userId = app.globalData.openId;
    var that = this;
    wx.request({
      url: 'http://47.92.252.164/trip-track/CheckMyTrack',
      data: {
        userId: userId
      },
      method: 'GET',
      success: (res) => {
        // console.log(res);
        var data = res.data;
        if(data) {
          app.globalData.myTrackData = that.trackDataHandler(data);

          wx.navigateTo({
            // url: '../myTrack/myTrack',
            url: '../echarts_myTrack/index',
          });
        }
      },
      fail: (err) => {
        console.log(err);
        wx.showToast({
          title: '获取足迹信息失败，请稍后重试',
          icon: 'none'
        })
      }
    })
  },
  trackDataHandler: function(data) {
    // return data.map(dataItem => {
    //   var time = util.formatTime(new Date(parseInt(dataItem.timeStamp)));
    //   return {
    //     id: dataItem.timeStamp,
    //     latitude: dataItem.latitude,
    //     longitude: dataItem.longitude,
    //     callout: {
    //       content: dataItem.locationName + '\n' + time,
    //       borderRadius: '8px',
    //       padding: '10px',
    //       textAlign: 'center'
    //     }
    //   }
    // });

    
    var provinceData = {};
    data.forEach(dataItem => {
      var province = dataItem.province;
      if (provinceData[province]) {
        provinceData[province] += 1;
      }
      else {
        provinceData[province] = 1;
      }
    });
    
    var result = Object.keys(provinceData).map(provinceName => {
      provinceName = this.formatProvinceName(provinceName);
      return {
        name: provinceName,
        dayCount: provinceData[provinceName]
      }
    });
    // console.log(result);
    return result;
  },
  formatProvinceName: function(provinceName) {
    if (provinceName.indexOf("新疆") >= 0) {
      return "新疆";
    }
    else if (provinceName.indexOf("内蒙古") >= 0) {
      return "内蒙古";
    }
    else if (provinceName.indexOf("广西") >= 0) {
      return "广西";
    }
    else if (provinceName.indexOf("西藏") >= 0) {
      return "西藏";
    }
    else if (provinceName.indexOf("宁夏") >= 0) {
      return "宁夏";
    }
    else if (provinceName.indexOf("香港") >= 0) {
      return "香港";
    }
    else if (provinceName.indexOf("澳门") >= 0) {
      return "澳门";
    }
    else {
      return provinceName.replace(/[省市]/,"");
    }
  }
})