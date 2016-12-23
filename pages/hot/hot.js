const AV = require('../../utils/av-weapp');
const u = require('../../utils/util');
// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    page: 0,
    limit: 20,
    loading: true,
    hasMore: true,
    recipes: [],
      swiperHeight:0,
      Id:''
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
    loadMore () {
        if (!this.data.hasMore) return;
        if(this.data.page==0){this.data.page++};
        console.log('loadMore触发');

        AV.Cloud.run('recipeList', {
                sort: 'hottest',
                term: 30,
                ex: '',
                l: this.data.limit,
                p: this.data.page
            }, {remote: true})
            .then(list=> {
                console.log('list',list);
                console.log(this.data.page);
                console.log('加载中的hasMore',this.data.hasMore);
                let a = this.data.recipes.concat(list);
                a = u.removeDuplicates(a, "objectId");
                if (list.length) {
                    this.setData({recipes: a, loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }

            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                console.error(e)
            })
        this.data.page++;
        console.log('loadMore!!!Sgu',this.data.page);
        console.log("recipes",this.data.recipes);
    },

  // 页面加载
  //onLoad (params) {
  //    console.log('onLoad');
  //    console.log(params);
  //    this.refresh();
  //}

  onShow (){
      console.log('onShow排行');
      this.refresh();

  },
    refresh(){
        // console.log(params);
        wx.showNavigationBarLoading()
        AV.Cloud.run('recipeList', {
                sort: 'hottest',
                term: 30,
                ex: '',
                l: this.data.limit,
                p: this.data.page
            }, {remote: true})
            .then(list=> {
                console.log(list)
                //this.data.page++;
                if (list.length) {
                    this.setData({recipes: list, loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }
                wx.hideNavigationBarLoading()
                //setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                console.error(e)
                wx.hideNavigationBarLoading()
            });
    },
    upper(){
        wx.showNavigationBarLoading();
        console.log("排行upper");
        this.data.page = 0;
        this.setData({hasMore:true});
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
        }
    ,  tapFive(event){
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
});
