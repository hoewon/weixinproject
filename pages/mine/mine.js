
const AV = require('../../utils/av-weapp');
var app = getApp();
Page({
    data: {
        userInfo: {}
    },
    onLoad: function() {
            var that = this;
        //AV.User.loginWithWeapp().then(user => {
        //    this.globalData.user = user.toJSON();
        //
        //}).catch(console.error);
    //    var that = this
    //    //调用应用实例的方法获取全局数据
    //    app.getUserInfo( function( userInfo ) {
    //        //更新数据
    //        that.setData( {
    //            userInfo: userInfo
    //        })
    //    })
    },
    toSub(e){
        console.log('投稿')
        console.log(e)
        wx.navigateTo({
            url: '../sub/sub'
        })

    },



})