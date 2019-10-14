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
      this.setData({
        selectedCode: e.target.dataset.code
      })
    }
  }
})
