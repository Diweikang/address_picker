Component({
  properties: {
    // 区域数据
    data: {
      type: Array,
      value: []
    },
    // 顶部提示语
    title: {
      type: String,
      value: ''
    },
    // 区域选中项目
    active: {
      type: String,
      value: ''
    }
  },
  methods: {
    // 切换区域触发
    changeTab(e) {
      this.triggerEvent('change', e.target.dataset.item)
    },
    // 点击搜索框显示
    clickInput() {
      this.triggerEvent('showSearch', true)
    }
  }
})
