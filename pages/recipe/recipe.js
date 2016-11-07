// Douban API 操作
const AV = require('../../utils/av-weapp');

// const douban = require('../../libraries/douban.js')

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    title: '',
    loading: true,
    recipe: {},
    // list
    page: 0,
    limit: 20,
    // type: 'in_theaters',
    // subtitle: '加载中...',
    hasMore: true,
    recipes: [],
    isFav: false,
    share: 0,
    favorite: 0,
    draw: true


  },

  onLoad (params) {

    // 传参机制,更接近web?'

    const {id, title} = params;
    console.log(params);

    this.setData({
      title: title,
    });
    // console.log(id);

     //const video = 'http://ac-4s28kj56.clouddn.com/8a1a5a0e83d5044c9081.mp4';
    const video = "https://dn-4s28kj56.qbox.me/31be8bd7ced64d6d.mp4"




    // AV.Cloud.run('recipe', {id: id}, {remote: true})
    //   .then(o=> {
    //
    //     console.log(o);
    //     // if (d.subjects.length) {
    //     this.setData({
    //       // title: o.recipe.title,
    //       recipe: o.recipe,
    //       tags: o.tags,
    //       loading: false,
    //       // share:o.recipe.share,
    //       favorite: o.recipe.favorite,
    //       src: video,
    //       desc:o.recipe.desc? o.recipe.desc.slice(0,20) :''
    //     })
    //   })
    //   .catch(e => {
    //     this.setData({title: '获取数据异常', recipe: {}, loading: false});
    //     console.error(e)
    //   });

    AV.Cloud.run('isFav', {id: id}, {remote: true})
      .then((o)=> {
        console.log('状态' + o.isFav);
        this.setData({isFav: o.isFav});
      })
      .catch((err) => {
          console.log(err);
        }
      );

    AV.Cloud.run('recipeList', {
      sort: 'latest',
      term: '',
      ex: '',
      l: this.data.limit,
      p: this.data.page
    }, {remote: true})
      .then(list=> {
        this.data.page++;
        // if (d.subjects.length) {
        this.setData({recipes: list, loading: false});
        // } else {
        //   this.setData({hasMore: false, loading: false})
        // }
      })
      .catch(e => {
        this.setData({subtitle: '获取数据异常', recipes: [], loading: false});
        console.error(e)
      })
  },


  onReady () {
    wx.setNavigationBarTitle({title: this.data.title});

  },


  loadMore () {
    // 这里是用总长来判断是否有更多内容

    if (!this.data.hasMore) return;

    this.setData({subtitle: '加载中...', loading: true});
    AV.Cloud.run('recipeList', {
      sort: 'latest',
      term: '',
      ex: '',
      l: this.data.limit,
      p: this.data.page
    }, {remote: true})
      .then(d => {
        this.data.page++;
        if (d.length) {
          this.setData({recipes: this.data.recipes.concat(d), loading: false})
        } else {
          this.setData({hasMore: false, loading: false})
        }
      })
      .catch(e => {
        this.setData({subtitle: '获取数据异常', loading: false});
        console.error(e)
      })
  },

  tapTag(event) {
    console.log(event)

    let id = event.target.id;
    let title = event.target.dataset.title;
    wx.navigateTo({
      url: '../recipeList/recipeList?sort=tag&term=' + id + '&title=' + title
    })
  },

  tapFav(event){
    // 判定是否登陆 ,如果未登录要去登陆
    // AV.User.logIn('1', '1').then(user => {
    //   console.log(user);
    //   this.globalData.user = user;
    AV.Cloud.run('fav', {id: this.data.recipe.objectId, isFav: this.data.isFav}, {remote: true})
      .then((o)=> {
        console.log(o)
        // 只触发监听, 不触发本体
        this.setData({
          isFav: o,
          favorite: o ? this.data.favorite + 1 : this.data.favorite - 1
        });
      }).catch((err) => {
      console.log(err);
    })

    //
    //   }, console.error);
    //
    //
    //
  },

  tapSub(e){
    var a1 = wx.createAnimation({
      duration: 5000,
      timingFunction: 'linear',
      // delay: 1000
    })

    var a2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      // delay: 1000
    })

    if (this.data.draw) {
      a1.height('auto').step();
      a2.rotate(-180).step();

      this.setData({
        // animationData: a1.export(),
        a2: a2.export(),
        draw: false
      })
    } else {
      a1.height('80rpx').step();
      a2.rotate(0).step();

      this.setData({
        // animationData: a1.export(),
        a2: a2.export(),
        draw: true
      })
    }
  },



})
