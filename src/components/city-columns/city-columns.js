Component({
  properties: {
    cityColumns: {
      type: Array,
      value: [],
      observer(newVal) {
        const selectedLevel = 'citys[' + this.data.selectedLevel + ']'
        if (newVal.length > 0) {
          this.setData({
            toView: `id${newVal[0].code}`,
            [selectedLevel]: newVal
          })
        }
      }
    }
  },
  data: {
    citys: {},
    toView: '',
    cityCode: '',
    selectedLevel: 0,
    tabArr: [
      {
        name: '省/直辖市',
        level: 0
      }
    ],
    array: []
  },
  methods: {
    // 切换城市列表tab操作
    changeTab(e) {
      this.setData({
        selectedLevel: e.target.dataset.level
      })
    },
    // 选中城市列表中具体的城市
    slecteItem(e) {
      const name = 'tabArr[' + this.data.selectedLevel + '].name'
      if (e.target.dataset.item.level > 3) {
        this.setData({
          [name]: e.target.dataset.item.name,
          cityCode: e.target.dataset.item.code,
          toView: `id${e.target.dataset.item.code}`
        })
        return
      }
      this.data.tabArr.push({
        name: '请选择',
        level: this.data.selectedLevel + 1
      })
      this.setData({
        selectedLevel: this.data.selectedLevel + 1,
        cityCode: e.target.dataset.item.code,
        toView: `id${e.target.dataset.item.code}`,
        tabArr: this.data.tabArr,
        [name]: e.target.dataset.item.name
      })
      // 触发选中的事件
      this.triggerEvent('select', e.target.dataset.item)
    }
  }
})
