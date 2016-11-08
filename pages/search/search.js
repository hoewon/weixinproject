// Douban API 操作
const douban = require('../../libraries/douban.js');
const AV = require('../../utils/av-weapp');

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    // 读取页面基础数据
    loaded:false,
    caption:[],
    page: 1,
    size: 20,
    subtitle: '请在此输入搜索内容',
    movies:[],
    text: '',
    loading: false,
    tags:[],
    disabled:true
    // hasMore: false,
  },

  onLoad(){
    AV.Cloud.run('categoryList', {sort: 'hot', term: '', ex: '', l: 9, p: ''}, {remote: true})
      .then((o)=> {
        console.log(o);
        this.setData({
          hot: o ? o : [],

        });
      })
    //wx.clearStorage()
    wx.getStorage({
      key: 'key',
      success: function(res) {
        console.log(res)
       let a = JSON.parse(res)
        this.setData({
          caption:a

        });
      },
      fail: function(res){
        console.log(res)
        wx.setStorage({
          key:"key",
          //data: JSON.stringify([])
           data: {[]}


        })
      }
    })
      // Do something when catch error
    }
  ,

  input(e){
    console.log(e.detail.value,'tag 出口 转向taglist');
    const text = e.detail.value;
    if(text.length>0){
      this.setData({
        text:text,
        loading:true,
        disabled:false,
      });

      AV.Cloud.run('categoryList', {sort: 'search', term: text, ex: '', l: 5, p: 0}, {remote: true})
        .then((r)=> {
          this.setData({
            loading:false,
            tags: r?r:[]
          });
        })
        .catch(err => {
          console.log(err);
        })
    }else{
      this.setData({
        disabled:true,
        tags:[]
      });
    }
  },

  search (e) {
    console.log(e);
    // console.log(e.detail.value, 'keyword 出口 转向result');
    if (!e.detail.value.keyword) return;
    // keyword 出口 转向result
    this.toResult(e.detail.value.keyword)

    // 保存记录? 搜索记录先不弄, 第一版不搞本地

  },
  // 同样是两种出口, tag 和 keyword/result

  tapTag: function(event) {
    console.log(event)

    let tag = event.target.id;
    let title = event.target.dataset.title;
    this.toTag(tag,title);
  },

  toTag(id,title){
    //console.log(id);
    wx.navigateTo({
      url: '../recipeList/recipeList?sort=tag&term='+id+'&title='+title
    });
    //console.log(title);
    try {
      wx.setStorageSync('caption', title)
    } catch (e) {

    }
  },

  toResult(k){
    //console.log(k,'result');
    wx.navigateTo({
      url: '../recipeList/recipeList?sort=keyword&term='+k+'&title='+k
    });
    //wx.setStorageSync('caption','k');
    //console.log(caption);
  }
})
