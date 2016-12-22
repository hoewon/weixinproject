const AV = require('../../utils/av-weapp');
var app = getApp();
const u = require('../../utils/util');
// 创建一个页面对象用于控制页面的逻辑
Page({
    data: {
        page: 0,
        limit: 5,
        loading: true,
        hasMore: true,
        recipes: [],
        swiperHeight:0,
        globalData:{
        },
        Id:''
    },

    // 页面加载
    onLoad (params) {
        // wx.showNavigationBarLoading()
        // this.data.title = params.title || this.data.title;
        // this.data.type = params.type || this.data.type;
        // 用传参的方式传入入sort?

        // const {} = params;

        //console.log('onLoad');
        //console.log('a',params.objectId);
      //this.refresh();
    },
    onShow:function(){
        console.log('onShow收藏');
        console.log(app.globalData);
        this.refresh();
    },
    onReady(){
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                console.log('onReady!!!!',res);
                that.setData({
                    swiperHeight: (res.windowHeight)
                });
            }
        })
    },
    onPullDownRefresh(){
        this.upper();
    },
    refresh(){
        wx.showNavigationBarLoading();
        console.log('refresh');
        //const {sort, term} = this.data;
        // 类型： in_theaters  coming_soon  us_box
        console.log('id',app.globalData.user.objectId);
        console.log(app.globalData);

        AV.Cloud.run('recipeList',
            {sort: 'favorite', term: app.globalData.user.objectId, ex: '', l: this.data.limit, p: this.data.page},
            {remote: true})
            .then(list=> {
                console.log('list!!!!!',list);
                console.log(this.data.limit);
                console.log(this.data.page);
                if (list.length) {
                    this.setData({recipes: list, loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }
                //this.data.page++;
                //setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
                wx.hideNavigationBarLoading()

            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                // console.error(e);
                wx.hideNavigationBarLoading()

            });
    },
    upper(){
        wx.showNavigationBarLoading();
        console.log("收藏upper");
        this.data.page=0;
        this.refresh();
        setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
    },
    touch(e){
        console.log('触摸');
        console.log(e)
        let Id = e.currentTarget.dataset.idfive;

        this.setData({
            Id:Id
        });
    },
    touchend(e){

        this.setData({
            Id:''
        });
    },
    loadMore () {


         //获得当前登录用户
//        const user = AV.User.current();
//// 调用小程序 API，得到用户信息
//        wx.getUserInfo({
//            success: ({userInfo}) => {
//                // 更新当前用户的信息
//                user.set(userInfo).save().then(user => {
//                    // 成功，此时可在控制台中看到更新后的用户信息
//                    this.globalData.user = user.toJSON();
//                }).catch(console.error);
//            }  ,
//            fail:({userInfo})=>{
//                AV.User.loginWithWeapp().then(user => {
//                    console.log('登陆')
//                    this.globalData.user = user.toJSON();
//                }).catch(console.error);
//            }
//        });
        if(this.data.page==0){this.data.page++};
        if (!this.data.hasMore) return;

            AV.Cloud.run('recipeList', {sort: 'favorite', term: 'objectId', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
            .then(list=> {
                console.log(this.data.page);
                let a = this.data.recipes.concat(list);
                a = u.removeDuplicates(a, "objectId");

                if (list.length) {
                    this.setData({recipes: a, loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }
                this.data.page++;
            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                console.error(e)
            })
    },
    //
    //onPullDownRefreash(){
    //    AV.Cloud.run('recipeList', {sort: 'favorite', term: 'objectId', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
    //        .then(list=> {
    //            if (list.length) {
    //                this.setData({recipes: list, loading: false})
    //            } else {
    //                this.setData({hasMore: false, loading: false})
    //            }
    //            this.data.page = 0;
    //
    //            wx.hideNavigationBarLoading()
    //
    //        })
    //        .catch(e => {
    //            this.setData({recipes: [], loading: false});
    //            // console.error(e);
    //            wx.hideNavigationBarLoading()
    //
    //        });
    //},
    tapFive(event){
        console.log(event);
        console.log('跳！！！！！！！');
        let Id = event.currentTarget.dataset.idfive;
        let title = event.currentTarget.dataset.titlefive;
        let page =  getCurrentPages();
        let url = '../recipe/recipe?id='+Id+'&title='+title
        console.log(page);
        if(page.length<3){
            wx.navigateTo({
                url:url
                //  //url: '../recipeList/recipeList?sort=keyword&term='+key+'&title='+key
            });
        }else{
            wx.redirectTo({
                url:url
            })
        }

    }
})
