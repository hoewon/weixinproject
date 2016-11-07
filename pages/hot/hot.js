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
    if (!this.data.hasMore) return;
    AV.Cloud.run('recipeList', {
      sort: 'hottest',
      term: 'totally',
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

  // 页面加载
  onLoad () {
    // console.log(params);
    wx.showNavigationBarLoading();
    AV.Cloud.run('recipeList', {
      sort: 'hottest',
      term: 'totally',
      ex: '',
      l: this.data.limit,
      p: this.data.page
    }, {remote: true})
      .then(list=> {
        this.data.page++;
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
  }
});