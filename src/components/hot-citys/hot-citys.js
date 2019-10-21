Component({
  properties: {
    data: {
      type: Array,
      value: []
    },
    active: {
      type: String,
      value: ''
    }
  },
  lifetimes: {
    // 每次初始化清空选中的热门城市数据
    attached() {
      this.triggerEvent('clear')
    }
  },
  methods: {
    selected(e) {
      const {item} = e.target.dataset
      this.triggerEvent('select', item)
    }
  }
})
