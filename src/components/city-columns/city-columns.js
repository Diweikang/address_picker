Component({
  properties: {
    cityColumns: {
      type: Array,
      value: [],
      observer(newVal) {
        const selectedTab = 'citys[' + this.data.selectedTab + ']'
        if (newVal.length > 0) {
          this.setData({
            toView: `id${newVal[0].code}`,
            [selectedTab]: newVal
          })
        }
      }
    },
    hotCity: {
      type: Object,
      value: {},
      observer(newVal) {
        if (newVal.code) {
          this.clearToView()
          let {tabArr, selectedTab} = this.data
          tabArr = [
            {
              name: '省/直辖市',
              level: 0
            }
          ]
          selectedTab = 0
          this.addItemToTabArr(tabArr, selectedTab)
          this.setData({
            tabArr,
            selectedTab: selectedTab + 1,
            toView: '',
            cityCode: ''
          })
        }
      }
    }
  },
  data: {
    citys: {},
    toView: '',
    cityCode: '',
    selectedTab: 0,
    tabArr: [
      {
        name: '省/直辖市',
        level: 0
      }
    ]
  },
  methods: {
    // 切换城市列表tab操作
    changeTab(e) {
      const level = e.target.dataset.level
      this.setData({
        selectedTab: level
      })
      this.getToView(level)
    },
    // 选中城市列表中具体的城市
    slecteItem(e) {
      const {selectedTab, tabArr} = this.data
      const item = e.target.dataset.item
      const toView = `id${e.target.dataset.item.code}`
      const name = 'tabArr[' + selectedTab + '].name'
      const level = 'tabArr[' + selectedTab + '].level'
      // 对选中的城市对象添加toView属性
      this.setToView(selectedTab, item.code, toView)
      this.setTabArr(name, level, item)
      if (item.level > 3) {
        this.setData({
          [name]: item.name,
          cityCode: item.code,
          toView
        })
        return
      }
      this.addItemToTabArr(tabArr, selectedTab)
      this.updateTabArr(selectedTab, item, toView, tabArr, name)
      // 触发选中的事件
      this.triggerEvent('select', item)
      this.triggerEvent('clearHotChecked', selectedTab)
    },
    // 向tabArr中添加'请选择'元素
    addItemToTabArr(tabArr, selectedTab) {
      tabArr.push({
        name: '请选择',
        level: selectedTab + 1
      })
    },
    // 当选中城市后，tab对应更新为城市名
    updateTabArr(selectedTab, item, toView, tabArr, name) {
      this.setData({
        selectedTab: selectedTab + 1,
        cityCode: item.code,
        toView,
        tabArr,
        [name]: item.name
      })
    },
    // 修改选中的城市，对tabArr和城市列表进行修改
    setTabArr(name, level, item) {
      const {selectedTab, tabArr} = this.data
      if (selectedTab < tabArr.length - 1) {
        tabArr.splice(selectedTab + 1, tabArr.length - 1)
        this.setData({
          tabArr,
          [name]: item.name,
          [level]: selectedTab
        })
      }
    },
    // 为城市选项添加toView属性
    setToView(selectedTab, code, toView) {
      const cityColumns = this.data.citys[selectedTab]
      cityColumns.forEach(city => {
        if (city.code === code) {
          city.toView = toView
        }
      })
    },
    // 切换城市tab时定位toView
    getToView(level) {
      const cityColumns = this.data.citys[level]
      cityColumns.forEach(city => {
        if ('toView' in city) {
          this.setData({
            toView: city.toView,
            cityCode: city.code
          })
        }
      })
    },
    // 清空citys中元素的toView属性
    clearToView() {
      const {citys} = this.data
      for (const cityColumns of citys) {
        cityColumns.forEach(city => {
          if ('toView' in city) {
            delete city.toView
          }
        })
      }
      this.setData({
        citys
      })
    }
  }
})
