Component({
  properties: {
    // 数据结果
    data: {
      type: Array,
      value: []
    },
    // 选中项
    active: {
      type: String,
      value: ''
    }
  },
  methods: {
    // 选中具体选项触发事件
    select(e) {
      const {item} = e.target.dataset
      this.triggerEvent('select', item)
    }
  }
})
