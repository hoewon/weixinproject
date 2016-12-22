// Douban API 操作
const AV = require('../../utils/av-weapp');
var app = getApp();
//const douban = require('../../libraries/douban.js')

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    title: '',
    fxtitle:'',
    fxdesc:'',
    fxurl:'',
    loading: true,
    recipe: {},
    // list
    page: 0,
    limit: 10,
    // type: 'in_theaters',
    // subtitle: '加载中...',
    hasMore: true,
    recipes: [],
    isFav: false,
    isShare:false,
    share: 1,
    favorite: 0,
    draw: true,
    iconP: '../../images/like.png',
    uiconP:'../../images/unlike.png',
    globalData:{
    },
    loaded:false,
    text:''


  },

  onLoad (params) {
    wx.showNavigationBarLoading();
    const {id, title} = params;
    console.log(params);

    this.setData({
      title: title,
    });
    console.log(id);
    console.log(title);

    //const video = 'http://ac-4s28kj56.clouddn.com/8a1a5a0e83d5044c9081.mp4';
    const video = "https://dn-4s28kj56.qbox.me/31be8bd7ced64d6d.mp4";
//初始判断是否收藏
    AV.Cloud.run('isFav', {id: id}, {remote: true})
        .then((o)=> {
          console.log('o',o)

          // 只触发监听, 不触发本体

          this.setData({
            isFav: o,
            favorite: o ? this.data.favorite + 1 : this.data.favorite - 1
          });
        }).catch((err) => {
      console.log(err);
    });




    AV.Cloud.run('recipe', {id: id}, {remote: true})
        .then(o=> {
          console.log('id',id);
          console.log('o!!!!!!!oooo',o);
          this.data.fxtitle=o.recipe.title ;
          let text = o.recipe.desc.replace(/<br\/>/g,"\n");
          let des = o.recipe.desc.indexOf('<br/>');
          this.data.fxdesc=o.recipe.desc.slice(0,des);
          // if (d.subjects.length) {
          if(des<20){
            this.setData({
            desc:o.recipe.desc? o.recipe.desc.slice(0,des) :''
            });

          }else{
            this.setData({
              desc:o.recipe.desc? o.recipe.desc.slice(0,20) :''
            });

          }


          this.setData({
            // title: o.recipe.title,
            recipe: o.recipe,
            tags: o.tags,
            loading: false,
            //loaded:true,
            share:o.recipe.share,
            favorite: o.recipe.favorite,
            src: video,
            text:text
          })
          console.log(typeof(text));
          console.log('des',des);
        })
        .catch(e => {
          this.setData({title: '获数据异常', recipe: {}, loading: false});
          console.error(e)
        });



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


  //upper(){
  //  this.onShow();
  //},
  onShow(params){
    console.log('onShow');
    //console.log(params);
    console.log(getCurrentPages());
    this.setData({
      loaded:true,
    })


  },
  onShareAppMessage() {

    return {
      title: this.data.fxtitle,
      desc: this.data.fxdesc,
      path: this.data.fxurl
    }
  },

  onReady () {
    wx.setNavigationBarTitle({title: this.data.title});

  },
  tapFive(event){
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

  //loadMore () {
  //  // 这里是用总长来判断是否有更多内容
  //
  //  if (!this.data.hasMore) return;
  //
  //  this.setData({subtitle: '加载中...', loading: true});
  //  AV.Cloud.run('recipeList', {
  //        sort: 'latest',
  //        term: '',
  //        ex: '',
  //        l: this.data.limit,
  //        p: this.data.page
  //      }, {remote: true})
  //      .then(d => {
  //        this.data.page++;
  //        if (d.length) {
  //          this.setData({recipes: this.data.recipes.concat(d), loading: false})
  //        } else {
  //          this.setData({hasMore: false, loading: false})
  //        }
  //      })
  //      .catch(e => {
  //        this.setData({subtitle: '获取数据异常', loading: false});
  //        console.error(e)
  //      })
  //},

  tapTag(event) {
    console.log('标签！！！！！');
    console.log(event)
    let Id = event.currentTarget.dataset.idfive;
    let title = event.currentTarget.dataset.titlefive;
    let page =  getCurrentPages();
    //url="../recipeList/recipeList?sort=tag&term={{item.objectId}}&title={{item.title}}
    let url = '../recipeList/recipeList?sort=tag&term=' + Id + '&title=' + title;
  this.data.fxurl=url;
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


  tapShare(event){
    AV.Cloud.run('fav',{id: this.data.recipe.objectId, isShare: this.data.isFav}, {remote: true}).then((o)=>{
      console.log("分享",o);
      this.setData({
        isShare:o,
        share: this.data.share+1
      });
    }).catch((err) => {
      console.log(err);
    })
    wx.scanCode({
      success: (res) => {
        console.log('扫码',res)
      },
      fail:(res)=>{
        console.log('失败',res)
      }
    })

    //分享功能，微信未开放接口
    //function share(){
    //  console.log('share,分享');
    //
    //
    //}
    //
    //
    //wx.showActionSheet({
    //  itemList: ['分享', 'B', 'C'],
    //  success: function(res) {
    //    if (!res.cancel) {
    //      console.log("???",res.tapIndex)
    //     if(res.tapIndex==0){
    //       console.log('分享');
    //        //sh();
    //       share();
    //     }
    //    }
    //  }
    //})
  },
  tapFav(event){
    //收藏
    // 判定是否登陆 ,如果未登录要去登陆

// 调用小程序 API，得到用户信息
    const user = AV.User.current();
    wx.getUserInfo({
      success: ({userInfo}) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          console.log('已经登陆');

          // 成功，此时可在控制台中看到更新后的用户信息
          //this.globalData.user = user.toJSON();
          console.log('user',user)
        }).catch(console.error);
      },
      fail:({userInfo})=>{
        AV.User.loginWithWeapp().then(user => {
          console.log('登陆')
          this.globalData.user = user.toJSON();
        }).catch(console.error);
      }

    });

    AV.Cloud.run('fav', {id: this.data.recipe.objectId, isFav: this.data.isFav}, {remote: true})
        .then((o)=> {
          console.log('o',o)
          // 只触发监听, 不触发本体
          this.setData({
            isFav: o,
            favorite: o ? this.data.favorite + 1 : this.data.favorite - 1
          });
        }).catch((err) => {
      console.log(err);
    })


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


  tapSub(e){
    console.log(e);
    var a1 = wx.createAnimation({
      duration: 5000,
      timingFunction: 'linear',
    })

    var a2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',

    })
    if (this.data.draw) {
      a1.height('auto').step();
      a2.rotate(-180).step();
      a2.opacity(0).step();
      this.setData({
        a2: a2.export(),
        draw: false
      })
    } else {
      a1.height('80rpx').step();
      a2.rotate(0).step();
      a2.opacity('0').step();
      this.setData({
        a2: a2.export(),
        draw: true
      })
    }
  }
})