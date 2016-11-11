const AV = require('../../utils/av-weapp');
var app = getApp();
Page({
    data: {
        userInfo: {},
        id:'',
        title:'',
        url:'',
        subT:false,
        subU:false
    },
    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    },
    inputT(e){
        var that = this
        const text = e.detail.value.replace(/^\s+/,"");
        if(e.target.dataset.title){
        //const text = e.detail.value.replace(/^\s+/,"");
        console.log(e)
        console.log("text",text)
        if(text.length>0){
            that.setData({
                subT:true,
            })
        }else{
            that.setData
            ( {
                subT:false,
            })
        }
        }
        if(e.target.dataset.url){

            console.log("text",text)
            if(text.length>0){
                that.setData({
                    subU:true
                })
            }else{
                that.setData({
                    subU:false
                })
            }
        }

    }
    //inputU(e){
    //    var that = this
    //    const text = e.detail.value.replace(/^\s+/,"");
    //    console.log("text",text)
    //    if(text.length>0){
    //        that.setData({
    //            subU:true
    //        })
    //    }else{
    //        that.setData({
    //            subU:false
    //        })
    //    }
    //
    //}
    ,
    formSubmit(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        console.log(e.detail.value.title)
        console.log(e.detail.value.url)


        let Sub = AV.Object.extend('Contribute');
        let sub = new Sub();
        sub.set('title',e.detail.value.title);
        // 设置优先级
        sub.set('url',e.detail.value.url);
        sub.save().then(function (todo) {
            console.log('成功');
            wx.showModal({
                title: '提示',
                content: '成功提示框',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }, function (error) {
            console.error(error);
            wx.showModal({
                title: '提示',
                content: '失败提示框',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        });

    }




                // 只触发监听, 不触发本体
                //this.setData({
                //    key:e.detail.key,
                //    title；e.detail.title
                //});

        })
