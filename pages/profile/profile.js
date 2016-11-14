const AV = require('../../utils/av-weapp');
Page({
  data: {
    title: 'About Me',
    userInfo: {
      wechat: 'WEDN-NET',
      nickName: 'iceStone',
      avatarUrl: '../../images/wechat.jpeg'
    }
  },

  // 不存在登出的情况, 只有个授权登陆, 然后表现形式等lean那边做好了微信登陆再说
  // 头像
  // 收藏
  // 投稿
  // 反馈
  // 关于/ 版本

  // 主界面用收藏, 右上角菜单用其他项



  getUserInfo () {
    const that = this
    wx.getUserInfo({
      success (res) {
        console.log(res)
        that.setData({ userInfo: res.userInfo })
      }
    })
  },

  onLoad () {
// 获得当前登录用户
//    const user = AV.User.current();
//// 调用小程序 API，得到用户信息
//    wx.getUserInfo({
//      success: ({userInfo}) => {
//        console.log(userInfor)
//        // 更新当前用户的信息
//        user.set(userInfo).save().then(user => {
//          // 成功，此时可在控制台中看到更新后的用户信息
//          this.globalData.user = user.toJSON();
//        }).catch(console.error);
//      }
//    });



  }


})
