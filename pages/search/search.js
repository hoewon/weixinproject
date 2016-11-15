// Douban API 操作
//const douban = require('../../libraries/douban.js');
const AV = require('../../utils/av-weapp');
const u = require('../../utils/util');


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
    //输入开关
    display:true,
    //清除开关
    disable:true

    // hasMore: false,
  },
//页面加载
  onLoad(){
    wx.showNavigationBarLoading();
    AV.Cloud.run('categoryList', {sort: 'hot', term: '', ex: '', l: 9, p: ''}, {remote: true})
      .then((o)=> {
        //console.log(o);
        this.setData({
          hot: o ? o : [],

        });
      })



   //wx.clearStorage()
   // 获取本地存取
    let _this = this;
    wx.getStorage({
      key: 'caption',
      //如果有数据
      success: function(res) {
        console.log('成功')
        console.log('res'+res)

        console.log('data'+res.data)
        console.log('输出')
       //定义一个变量，解包数据
        let a = JSON.parse(res.data);
        //加载数据
        _this.setData({
          caption: a,
          disable:true
            })

      },

      //如果没有数据
      fail: function(res){
        console.log('失败')
        console.log(res)
        //console.log('asds',a);
        //添加一个空数据
        let o =[

        ]
        _this.setData({
          disable:false
        })
        wx.setStorage({
          key:'caption',
          //object
          // data:JSON.stringify([])
          data:JSON.stringify(o),
          success:function(res){
            console.log('失败后赋值')
            console.log(res)
          }
        })
      }
    })
      // Do something when catch error
    }
  ,
  onShow:function(){
    console.log('onshow');
   this.load()

  },
  load(){
    wx.showNavigationBarLoading();
    AV.Cloud.run('categoryList', {sort: 'hot', term: '', ex: '', l: 9, p: ''}, {remote: true})
        .then((o)=> {
          //console.log(o);
          this.setData({
            hot: o ? o : [],

          });
        })



    //wx.clearStorage()
    // 获取本地存取
    let _this = this;
    wx.getStorage({
      key: 'caption',
      //如果有数据
      success: function(res) {
        console.log('成功')
        console.log('res'+res)

        console.log('data'+res.data)
        console.log('输出')
        //定义一个变量，解包数据
        let a = JSON.parse(res.data);
        //加载数据
        _this.setData({
          caption: a,
          disable:true
        })

      },

      //如果没有数据
      fail: function(res){
        console.log('失败')
        console.log(res)
        //console.log('asds',a);
        //添加一个空数据
        let o =[

        ]
        _this.setData({
          disable:false
        })
        wx.setStorage({
          key:'caption',
          //object
          // data:JSON.stringify([])
          data:JSON.stringify(o),
          success:function(res){
            console.log('失败后赋值')
            console.log(res)
          }
        })
      }
    })
  },

  input(e){
    console.log(e.detail.value,'tag 出口 转向taglist');
    const text = e.detail.value.replace(/^\s+/,"");
    if(text.length>0){
      this.setData({
        text:text,
        loading:true,
        display:false
      });
      console.log(' 输入值');

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
        tags:[],
        display:true
      });
      console.log('输入框空')
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
  toCaption(e){
    console.log('历史跳转')
    console.log(e)
    let {key,title} = e.target.dataset;
    console.log(key)
    console.log(title)
    if(!title){
      console.log('单')
      wx.navigateTo({
        url: '../recipeList/recipeList?sort=keyword&term='+key+'&title='+key}
      );
    }else{
      console.log('双')
      wx.navigateTo({
        url: '../recipeList/recipeList?sort=tag&term=' + key + '&title=' + title
      });

    }

  },

  toClear(e){
    console.log('清除')
    //添加一个空数据
    wx.setStorage({
          key:'caption',
          //object
          // data:JSON.stringify([])
          data:JSON.stringify([])

  })
  this.setData({
    caption:[],
    disable:false
  })}
  ,
  //弹出框搜索
  toTag(e){
    //console.log(id);

    console.log('点击1')
    console.log('e',e)
    let {caption} = this.data;
    //等价let caption = this.data.caption;
    //key: id, title: title, type: 'tag',
    caption.unshift({key: e.target.dataset.id, title:e.target.dataset.title, type: 'tag'});
    caption = u.removeDuplicates(caption, "key");
    caption = caption.slice(0, 5);
    this.setData({
      caption: caption,
      disable:true
    });

    console.log(caption);
    wx.setStorage({
      key:'caption',
      //object

      data:JSON.stringify(caption),
      success:function(res){
        console.log('点击后赋值')
        console.log(res)
      }
    })
    let key = e.target.dataset.id;
    let title = e. target.title;

      wx.navigateTo({
        //url="../recipeList/recipeList?sort=tag&term={{item.objectId}}&title={{item.title}}
        url: '../recipeList/recipeList?sort=tag&term=' + key + '&title=' + title
      });
    }
  ,
  //搜索框搜索
  toResult(event){
    console.log('点击2')
    console.log('event',event)
    let {caption} = this.data;
    //等价let caption = this.data.caption;
    caption.unshift({key: event.target.dataset.id, type: 'keyword'});
    caption = u.removeDuplicates(caption, "key");
    caption = caption.slice(0, 5);
    this.setData({
      caption: caption,
      disable:true
    });
    console.log(caption);
    wx.setStorage({
      key:'caption',
      //object
      data:JSON.stringify(caption),
      success:function(res){
        console.log('点击后赋值')
        console.log(res)
      }
    })
    //console.log(k,'result');
    let key = event.target.dataset.id;
    wx.navigateTo({
      //url="../recipeList/recipeList?sort=keyword&term=11&title=11"
      //url="../recipeList/recipeList?sort=tag&term=57a80572a341310063420ea1&title=21421412"
      url: '../recipeList/recipeList?sort=keyword&term='+key+'&title='+key}
    );


  }
})
