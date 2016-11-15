const AV = require('../../utils/av-weapp');

// 创建一个页面对象用于控制页面的逻辑
Page({
    data: {
        page: 0,
        limit: 20,
        loading: true,
        hasMore: true,
        recipes: []
    },

    loadMore () {
        // 获得当前登录用户
        const user = AV.User.current();
// 调用小程序 API，得到用户信息
        wx.getUserInfo({
            success: ({userInfo}) => {
                // 更新当前用户的信息
                user.set(userInfo).save().then(user => {
                    // 成功，此时可在控制台中看到更新后的用户信息
                    this.globalData.user = user.toJSON();
                }).catch(console.error);
            }  ,
            fail:({userInfo})=>{
                AV.User.loginWithWeapp().then(user => {
                    console.log('登陆')
                    this.globalData.user = user.toJSON();
                }).catch(console.error);
            }
        });

        if (!this.data.hasMore) return;


        AV.Cloud.run('recipeList', {sort: 'favorite', term: 'objectId', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
            .then(list=> {
                console.log(this.data.page);

                if (list.length) {
                    this.setData({recipes: this.data.recipes.concat(list), loading: false})
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

    // 页面加载
    onLoad (params) {
        // wx.showNavigationBarLoading()
        // this.data.title = params.title || this.data.title;
        // this.data.type = params.type || this.data.type;
        // 用传参的方式传入入sort?

        // const {} = params;
        console.log(params);
        wx.showNavigationBarLoading();



        // 类型： in_theaters  coming_soon  us_box


        AV.Cloud.run('recipeList', {sort: 'favorite', term: 'objectId', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
            .then(list=> {
                if (list.length) {
                    this.setData({recipes: list, loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }
                this.data.page++;

                wx.hideNavigationBarLoading()

            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                // console.error(e);
                wx.hideNavigationBarLoading()

            });
    },
    onShow:function(){
        wx.showNavigationBarLoading();



        // 类型： in_theaters  coming_soon  us_box


        AV.Cloud.run('recipeList', {sort: 'favorite', term: 'objectId', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
            .then(list=> {
                if (list.length) {
                    this.setData({recipes: list, loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }
                this.data.page++;

                wx.hideNavigationBarLoading()

            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                // console.error(e);
                wx.hideNavigationBarLoading()

            });
    },

    onPullDownRefreash(){
        AV.Cloud.run('recipeList', {sort: 'favorite', term: 'objectId', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
            .then(list=> {
                if (list.length) {
                    this.setData({recipes: list, loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }
                this.data.page = 0;

                wx.hideNavigationBarLoading()

            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                // console.error(e);
                wx.hideNavigationBarLoading()

            });
    }
})
