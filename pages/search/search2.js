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
//页面加载
  onLoad(){
    AV.Cloud.run('categoryList', {sort: 'hot', term: '', ex: '', l: 9, p: ''}, {remote: true})
      .then((o)=> {
        //console.log(o);
        this.setData({
          hot: o ? o : [],

        });
      })
    //console.log(1111122222)
    //let o =[
    //  {"id":"1"},
    //  {"id":"2"},
    //  {"id":"3"}
    //]
    //JSON.stringify(o)
    //console.log('qwe',a)
    //console.log(JSON.parse(JSON.stringify(o)));
    //console.log(typeof(JSON.stringify(o)));

   //wx.clearStorage()
   // 获取本地存取
    let _this = this;
    wx.getStorage({
      key: 'caption',
      //如果有数据
      success: function(res) {
        console.log('成功')
        console.log(res)
        console.log(res.data)
       //定义一个变量，解包数据
        let a = JSON.parse(res.data);
       //let a = JSON.parse(res);
        //加载数据
        console.log('aa',a);
        _this.setData({
          caption: a
            })

      },

      //如果没有数据
      fail: function(res){
        console.log('失败')
        console.log(res)
        //console.log('asds',a);
        //添加一个空数据
        let o =[
          //{"id":"1"},
          //{"id":"2"},
          //{"id":"3"}
        ]
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
    console.log('点击1')
     //console.log('event',event)
    let {caption} = this.data;
    //等价let caption = this.data.caption;
    //key: id, title: title, type: 'tag',
    caption.unshift({key: event.target.dataset.id, title:event.target.dataset.title, type: 'tag'});

    //let t = tools.removeDuplicates(list, "key");
    //let o = t.slice(0, 5);
    this.setData({caption: caption});
    let o =[
     caption
    ]
    console.log(caption);
    wx.setStorage({
      key:'caption',
      //object

      data:JSON.stringify(o),
      success:function(res){
        console.log('点击后赋值')
        console.log(res)
      }
    })
    wx.navigateTo({
      url: '../recipeList/recipeList?sort=tag&term='+id+'&title='+title
    });
    //console.log(title);
    //保存数据

    }
  ,

  toResult(event){
    //console.log(k,'result');
    let key = event.target.dataset.id;
    wx.navigateTo({
      url: '../recipeList/recipeList?sort=keyword&term='+key+'&title='+key});

    console.log('点击2')
    console.log('event',event)
    let {caption} = this.data;
    //等价let caption = this.data.caption;
    //key: id, title: title, type: 'tag',
    caption.unshift({key: event.target.dataset.id, type: 'tag'});

    //let t = tools.removeDuplicates(list, "key");
    //let o = t.slice(0, 5);
    this.setData({caption: caption});
    let o =[
      caption
    ]
    console.log(caption);
    wx.setStorage({
      key:'caption',
      //object

      data:JSON.stringify(o),
      success:function(res){
        console.log('点击后赋值')
        console.log(res)
      }
    })





  }
})
