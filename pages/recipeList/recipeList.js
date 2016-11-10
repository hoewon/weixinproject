const AV = require('../../utils/av-weapp');

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
    wx.showNavigationBarLoading();
    let {sort, term, title} = params;
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

  onReady () {
    wx.setNavigationBarTitle({title: this.data.title})
  }
})
