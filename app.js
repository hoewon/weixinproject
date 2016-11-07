const AV = require('./utils/av-weapp');

AV.init({
  appId: "4s28kj56ii60yqy30pvxg19k7ssf38x8fo5x01veltmqwugx",
  appKey: "hxfq3kx6qo1ia2pau6z6k0a0z36tmbcl88l3fi8k4ixr3sjc",
});
// 创建应用程序对象
App({
  // ========== 全局数据对象（整个应用程序共享） ==========
  // globalData: {},

  // ========== 应用程序全局方法 ==========
  // fetchApi (url, callback) {
  //   // return callback(null, top250)
  //   wx.request({
  //     url,
  //     data: {},
  //     header: { 'Content-Type': 'application/json' },
  //     success (res) {
  //       callback(null, res.data)
  //     },
  //     fail (e) {
  //       console.error(e)
  //       callback(e)
  //     }
  //   })
  // },

  // ========== 生命周期方法 ==========

  // onLaunch () {
  //   // 应用程序启动时触发一次
  //   console.log('App Launch')
  // },

  // onShow () {
  //   // 当应用程序进入前台显示状态时触发
  //   console.log('App Show')
  // },

  // onHide () {
  //   // 当应用程序进入后台状态时触发
  //   console.log('App Hide')
  // }

  // ...
})
