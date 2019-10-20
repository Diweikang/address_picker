Component({
  properties: {
    groups: { // 属性名
      type: Array,
      value: []
    },
    title: {
      type: String,
      value: ''
    },
    active: {
      type: String,
      value: ''
    }
  },
  methods: {
    changeTab(e) {
      this.triggerEvent('change', e.target.dataset.item)
    },
    clickInput() {
      this.triggerEvent('showSearch', true)
    }
  }
})
