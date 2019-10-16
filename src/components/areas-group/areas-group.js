Component({
  properties: {
    groups: { // 属性名
      type: Array,
      value: []
    }
  },
  data: {
    selectedIndex: 0
  },
  methods: {
    changeTab(e) {
      this.setData({
        selectedIndex: e.target.dataset.item.code
      })
      this.triggerEvent('change', e.target.dataset.item)
    },
    clickInput() {
      this.triggerEvent('showSearch', false)
    }
  }
})
