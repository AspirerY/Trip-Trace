const app = getApp();

// 引入腾讯地图AOI
var QQMapWX = require('../../libs/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    latitude: '',
    longitude: '',
    mapScale: 14,
    mapContext: null
  },
  onLoad: function () {
    var that = this;
    wx.getLocation({
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
    });

    this.data.mapContext = wx.createMapContext("map", this);

    qqmapsdk = new QQMapWX({
      key: '5WEBZ-JNRCJ-TM7FP-FIL4Y-KLTO6-V6FLS'
    });
  },
  checkHandler: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        var address = res.address,name = res.name,lat = res.latitude,lng = res.longitude;

        var time = Date.now();
        var userId = app.globalData.openId;
        var checkData = {
          address: address,
          name: name,
          timeStamp: time,
          latitude: lat,
          longitude: lng,
          userId: userId
        };

        var provinceIndex = address.indexOf("省");
        if (provinceIndex == 2 || provinceIndex == 3) {
          checkData['province'] = address.substring(0,provinceIndex);
          that.saveCheckDataToDB(checkData);
        }
        else {
          that.getProvinceByCoord(checkData);
        }
      },
    })
  },
  // 不能确定定位点省份，调用腾讯地图API解析
  getProvinceByCoord: function(checkData) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: checkData.latitude,
        longitude: checkData.longitude
      },
      success: function (res) {
        if (res && res.status == 0) {
          var result = res.result;
          if (result && result.address_component) {
            checkData['province'] = result.address_component.province;
            that.saveCheckDataToDB(checkData);
          }
        }
      },
      fail: function(err) {
        wx.showToast({
          title: '签到失败，请重试',
          icon: 'none'
        });
      }
    })
  },
  saveCheckDataToDB: function (checkData) {
    wx.request({
      url: 'http://47.92.252.164/trip-track/SaveCheckInfo',
      data: checkData,
      method: 'GET',
      success: (res) => {
        wx.showToast({
          title: '签到成功'
        })
      },
      fail: (err) => {
        console.log(err);
        wx.showToast({
          title: '签到失败，请稍后重试',
          icon: 'none'
        })
      }
    });
  },
  zoomIn: function() {
    this.zoom(1);
  },
  zoomOut: function() {
    this.zoom(-1);
  },
  zoom: function(delta) {
    var that = this;
    this.data.mapContext.getScale({
      success: function(res) {
        var newScale = res.scale + delta;
        that.setData({
          mapScale: newScale
        })
      }
    })
  },
  checkUserInfo: function() {
    wx.navigateTo({
      url: '../userInfo/userInfo',
    })
  },
  locate: function() {
    var that = this;
    wx.getLocation({
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          mapScale: 14
        })
      },
    })
  }
})