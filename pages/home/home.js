const AV = require('../../utils/av-weapp');

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    page: 0,
    limit: 10,
    loading: true,
    hasMore: true,
    recipes: [],
      loaded:false
  },



  // 页面加载
     onLoad (params){
         //console.log('onLoad');
         //console.log(params);
         //this.refresh();
    },
    onShow (){
        console.log('onShow首页');
        //this.data.page = 0;
        this.refresh();

        console.log('show!!!Sgu',this.data.page);
        console.log(this.data.limit);

    },
    refresh(){
        wx.showNavigationBarLoading()

        // 类型： in_theaters  coming_soon  us_box


        AV.Cloud.run('recipeList', {sort: 'latest', term: '', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
            .then(list=> {
                if (list.length) {
                    this.setData({recipes: list, loading: false})

                } else {
                    this.setData({hasMore: false, loading: false})
                }
                //this.data.page++;

                wx.hideNavigationBarLoading()

            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                // console.error(e);
                wx.hideNavigationBarLoading()

            });
    },
  //
  //onPullDownRefreash(){
  //  AV.Cloud.run('recipeList', {sort: 'latest', term: '', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
  //    .then(list=> {
  //      if (list.length) {
  //        this.setData({recipes: list, loading: false})
  //      } else {
  //        this.setData({hasMore: false, loading: false})
  //      }
  //      this.data.page = 0;
  //
  //      wx.hideNavigationBarLoading()
  //
  //    })
  //    .catch(e => {
  //      this.setData({recipes: [], loading: false});
  //      // console.error(e);
  //      wx.hideNavigationBarLoading()
  //
  //    });
  //},
    tapFive(event){
        console.log('首页跳！！！！');
        console.log(event);
        let Id = event.currentTarget.dataset.idfive;
        let title = event.currentTarget.dataset.titlefive;
        let page =  getCurrentPages();
        let url = '../recipe/recipe?id='+Id+'&title='+title

            wx.navigateTo({
                url:url
            })

        },

    upper() {
        wx.showNavigationBarLoading();
        console.log("首页upper");
        this.data.page=0;
        this.refresh();
        setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
        //setTimeout(function(){
        //    wx.hideNavigationBarLoading();
        //    wx.stopPullDownRefresh();
        //}, 2000);
    },
    loadMore () {
        if (!this.data.hasMore) return;

        console.log('loadMore触发');
        AV.Cloud.run('recipeList', {sort: 'latest', term: '', ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
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
        console.log('loadMore!!!Sgu',this.data.page);
    }
})
