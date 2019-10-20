Component({
  properties: {
    hotCitys: {
      type: Array,
      value: []
    }
  },
  data: {
    selectedCode: ''
  },
  lifetimes: {
    // 每次初始化清空选中的热门城市数据
    attached() {
      this.triggerEvent('clearHotselected', 0)
    }
  },
  methods: {
    selected(e) {
      const {item} = e.target.dataset
      this.setData({
        selectedCode: item.code
      })
      this.triggerEvent('select', item)
    },
    clearSelected() {
      this.setData({
        selectedCode: ''
      })
    }
  }
})
