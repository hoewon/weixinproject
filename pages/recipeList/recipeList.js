const AV = require('../../utils/av-weapp');

Page({
    data: {
        page: 0,
        limit: 20,
        loading: true,
        hasMore: true,
        recipes: [],
        share:false,
        tkl:'',
        title:'',
        fxtitle:'',
        fxdesc:'',
        fxurl:''
    },

    loadMore () {
        if (!this.data.hasMore) return;
        console.log('loadMore触发');
        const {sort, term} = this.data;

        AV.Cloud.run('recipeList', {
                sort: sort,
                term: term,
                ex: '',
                l: this.data.limit,
                p: this.data.page
            }, {remote: true})
            .then(list=> {
                this.data.page++;
                if (list.length) {
                    this.setData({recipes: this.data.recipes.concat(list), loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }
            })

            .catch(e => {
                this.setData({recipes: [], loading: false});
                console.error(e)
            })
    },

    onLoad (params) {
        console.log('lai!!!!',params)
        wx.showNavigationBarLoading();
        let {sort, term, title} = params;
        this.data.fxtitle=title;
        this.data.fxdesc='关于这个'+title+'的视频';
        this.data.fxurl='/recipeList/recipeList?sort='+sort+'&term=' + term + '&title=' + title


        if(sort=='tag'){
            AV.Cloud.run('tag', {id: term}, {remote: true}).then((o)=>{
                console.log("标签",o);

               let tkl = o.tkl;
                console.log('tkl',tkl);
                this.setData({
                    tkl:tkl,
                    title:title
                });
            }).catch((err) => {
                console.log(err);
            })


            this.setData({
                share:true

            })
        }

        if (!sort && !term) {
                sort = 'hottest',
                term = 'weekly'
        }
        this.setData({sort: sort, term: term, title: title});
        // console.log(sort,term);
        AV.Cloud.run('recipeList', {sort: sort, term: term, ex: '', l: this.data.limit, p: this.data.page}, {remote: true})
            .then(list=> {
                this.data.page++;
                console.log('跳转')
                console.log(list)
                if(list.length<this.data.limit){
                    this.setData({hasMore: false, loading: false})
                }
                if (list.length) {
                    this.setData({recipes: list, loading: false})
                } else {
                    this.setData({hasMore: false, loading: false})
                }
                wx.hideNavigationBarLoading()
            })
            .catch(e => {
                this.setData({recipes: [], loading: false});
                console.error(e)
                wx.hideNavigationBarLoading()
            });
    },
    upper() {
        wx.showNavigationBarLoading();
        console.log("upper");
        this.refresh();
        setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
    },


    onReady () {
        wx.setNavigationBarTitle({title: this.data.title})
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                console.log('onReady!!!!',res);
                that.setData({
                    swiperHeight: (res.windowHeight)
                });
            }
        })
    }
    ,
    tapFive(event){
        console.log('首页跳！！！！');
        console.log(event);
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
    onShareAppMessage() {

        return {
            title: this.data.fxtitle,
            desc: this.data.fxdesc,
            path: this.data.fxurl
        }
    }
})