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
  methods: {
    selected(e) {
      const {item} = e.target.dataset
      this.setData({
        selectedCode: item.code
      })
      this.triggerEvent('check', item)
    },
    clearSelected() {
      this.setData({
        selectedCode: ''
      })
    }
  }
})
