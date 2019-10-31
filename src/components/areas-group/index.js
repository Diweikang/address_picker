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
    },
    // 搜索框需要回显的结果
    value: {
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
    },
    // 点击关闭按钮触发的事件
    close() {
      this.triggerEvent('close')
    }
  }
})
