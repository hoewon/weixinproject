const AV = require('./utils/av-weapp');

AV.init({
  appId: "4s28kj56ii60yqy30pvxg19k7ssf38x8fo5x01veltmqwugx",
  appKey: "hxfq3kx6qo1ia2pau6z6k0a0z36tmbcl88l3fi8k4ixr3sjc",
});
// 创建应用程序对象
App({
  // ========== 全局数据对象（整个应用程序共享） ==========
   globalData:{
   },

  // ========== 应用程序全局方法 ==========

  // ========== 生命周期方法 ==========

  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    AV.User.loginWithWeapp().then(user => {
      this.globalData.user = user.toJSON();
    }).catch(console.error);

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //微信登陆
  //getUserInfo:function(cb){
  //  var that = this
  //  if(this.globalData.userInfo){
  //    typeof cb == "function" && cb(this.globalData.userInfo)
  //  }else{
  //    //调用登录接口
  //    wx.login({
  //      success: function () {
  //        wx.getUserInfo({
  //          success: function (res) {
  //            that.globalData.userInfo = res.userInfo
  //            typeof cb == "function" && cb(that.globalData.userInfo)
  //          }
  //        })
  //      }
  //    })
  //  }
  //},
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData:{
    userInfo:null
  }

})
