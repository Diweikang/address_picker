Component({
  properties: {
    searchCitys: { // 属性名
      type: Array,
      value: []
    }
  },
  data: {
    timer: null,
    inputValue: ''
  },
  lifetimes: {
    // 每次初始化清空选中的搜索城市数据
    attached() {
      this.triggerEvent('clearSearchCity')
    }
  },
  methods: {
    // 点击取消时，隐藏搜索框
    hideSearch() {
      this.triggerEvent('hideSearch', false)
    },
    // 当输入框内容变化时进行搜索
    inputChange(e) {
      const val = e.detail.value
      if (this.data.timer) {
        clearTimeout(this.timer)
      }
      if (val) {
        const timer = setTimeout(() => {
          this.triggerEvent('searching', val)
        }, 1000)
        this.setData({
          timer
        })
      } else {
        this.triggerEvent('searching', val)
      }
    },
    // 选中具体的城市
    selectCityItem(e) {
      const {item} = e.target.dataset
      const {name, parents} = item
      const cityArr = []
      const inputValue = `${name}-${parents[parents.length - 1].name}`
      this.setData({
        inputValue
      })
      cityArr.unshift(item)
      if (item.parents.length >= 2) {
        cityArr.unshift(item.parents[parents.length - 1])
      } else {
        cityArr.unshift(item.parents[parents.length - 1])
      }
      // 触发隐藏搜索框
      this.triggerEvent('selectSearch', cityArr)
      this.triggerEvent('hideSearch', false)
    }
  }
})
