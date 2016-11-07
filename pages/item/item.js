// Douban API 操作
const douban = require('../../libraries/douban.js')

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    title: '',
    loading: true,
    movie: {},
    src:''
    // video:'https://dn-4s28kj56.qbox.me/31be8bd7ced64d6d.mp4',
    // video:'http://ac-4s28kj56.clouddn.com/8a1a5a0e83d5044c9081.mp4'
  },

  onLoad (params) {
    var video = 'http://ac-4s28kj56.clouddn.com/8a1a5a0e83d5044c9081.mp4';
    // var video = "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400";
    douban.findOne(params.id)
      .then(d => this.setData({ title: d.title, movie: d, loading: false, src:video }))
      .catch(e => {
        this.setData({ title: '获取数据异常', movie: {}, loading: false, src:video })
        console.error(e)
      })
  },

  onReady () {
    wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
  },

  bindButtonTap: function() {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front','back'],
      success: function(res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  videoErrorCallback: function(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  }
})
