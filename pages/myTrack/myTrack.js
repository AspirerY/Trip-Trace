const app = getApp();

Page({
  data: {
    myTrackData: app.globalData.myTrackData,
    latitude: 34.20,
    longitude: 108,
    initialScale: 3
  },
  onLoad: function() {
    // console.log(app.globalData.myTrackData)
    this.setData({
      myTrackData: app.globalData.myTrackData
    })
  }
})