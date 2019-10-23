Component({
  properties: {
    // 搜索数据结果
    data: {
      type: Array,
      value: []
    }
  },
  data: {
    timer: null,
    inputValue: ''
  },
  methods: {
    // 点击取消时，隐藏搜索框
    hideSearch() {
      this.triggerEvent('hide', false)
    },
    // 当输入框内容变化时进行搜索
    inputChange(e) {
      const val = e.detail.value
      if (this.data.timer) {
        clearTimeout(this.data.timer)
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
      // 触发隐藏搜索框
      this.triggerEvent('select', item)
      this.triggerEvent('hide', false)
    }
  }
})
