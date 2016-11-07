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
    wx.login({
      success (res) {
        if (res.code) {
          console.log('登录成功！' + res.code)
        } else {
          console.error('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail () {},
      complete () {},
    })
  }
})
