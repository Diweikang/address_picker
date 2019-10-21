Component({
  properties: {
    // 城市列表数据发生变化
    columns: {
      type: Array,
      value: [],
      observer(newVal) {
        const selectedTab = 'citys[' + this.data.selectedTab + ']'
        if (newVal.length > 0) {
          this.setData({
            toView: `id${newVal[0].code}`,
            [selectedTab]: newVal
          }, () => {
            const {
              searchCity,
              selectedTab,
              selectedData,
              citys
            } = this.data
            if (searchCity.length > 0) {
              const level = selectedTab
              const tabItem = searchCity[level]
              this.setToviewAndCityCode(tabItem)
            }
            if (selectedData.name && ((citys.length - 1) > selectedTab)) {
              citys.splice(selectedTab + 1, 1)
              this.setData({
                citys
              })
            }
          })
        }
      }
    },
    // 选中热门城市的触发
    selectedData: {
      type: Object,
      value: {},
      observer(newVal) {
        if (Object.keys(newVal).length > 0) {
          this.clearSearchCity()
          let {tabArr, selectedTab, title} = this.data
          tabArr = [
            {
              name: title,
              level: 0,
              code: ''
            }
          ]
          if (newVal.addressType === 2) {
            selectedTab = 0
            this.addItemToTabArr(tabArr, selectedTab)
            this.setData({
              tabArr,
              selectedTab: selectedTab + 1,
              toView: '',
              cityCode: ''
            })
          } else {
            this.setData({
              selectedTab: 0,
              toView: '',
              cityCode: ''
            })
          }
        }
      }
    },
    // 选中搜索的城市触发的事件
    searchCity: {
      type: Array,
      value: [],
      observer(newVal) {
        let {tabArr} = this.data
        tabArr = [
          {
            name: this.data.title,
            level: 0
          }
        ]
        this.setData({
          tabArr,
          selectedTab: 0,
          toView: '',
          cityCode: ''
        })
        if (newVal.length > 0) {
          newVal.forEach(item => {
            this.cityChangeBySearchCity(item)
          })
        }
      }
    },
    title: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          citys: {}
        })
        let {tabArr} = this.data
        tabArr = []
        tabArr = [
          {
            name: newVal,
            level: 0,
            code: ''
          }
        ]
        this.setData({
          tabArr,
          selectedTab: 0,
          toView: '',
          cityCode: ''
        })
      }
    },
    maxLevel: {
      type: Number
    }
  },
  data: {
    citys: {},
    toView: '',
    cityCode: '',
    selectedTab: 0,
    tabArr: []
  },
  lifetimes: {
    // 每次初始化获取省/直辖市
    attached() {
      if (!this.data.searchCity.length) {
        this.initCitys()
      }
    }
  },
  methods: {
    // 初始化页面的省市区
    initCitys() {
      this.setData({
        citys: {}
      })
      this.triggerEvent('getColumnValue')
    },
    // 切换城市列表tab操作
    changeTab(e) {
      const tab = e.target.dataset.item
      this.setData({
        selectedTab: tab.level
      })
      this.getToView(tab)
      // 有搜索数据时切换tab
      // const {selectedTab, searchCity} = this.data
      // if (searchCity.length > 0) {
      //   const name = 'tabArr[' + selectedTab + '].name'
      //   const level = 'tabArr[' + selectedTab + '].level'
      //   this.setTabArr(name, level, searchCity[index])
      // }
    },
    // 选中城市列表中具体的城市，并返回选中的城市
    slecteItem(e) {
      const item = e.target.dataset.item
      const {selectedTab, tabArr, maxLevel} = this.data
      const toView = `id${item.code}`
      // tabArr中的属性
      const name = 'tabArr[' + selectedTab + '].name'
      const code = 'tabArr[' + selectedTab + '].code'
      // if (this.data.searchCity.length > 0) {
      //   const searchCity = this.data.searchCity
      //   searchCity.splice(selectedTab, 1, item)
      //   this.triggerEvent('changeSearchCity', searchCity)
      //   if (!selectedTab) {
      //     this.clearSearchCity()
      //   }
      // }
      this.setTabArr()
      if (tabArr.length >= maxLevel) {
        this.addItem(name, toView, item, code)
        return
      }
      this.addItemToTabArr(tabArr, selectedTab)
      this.addItem(name, toView, item, code)
      // 触发选中的事件
      this.triggerEvent('getColumnValue', item)
      if (item.groupCode !== '2') {
        this.triggerEvent('clear', selectedTab)
      }
    },
    // 将选中的城市赋值给tabArr
    addItem(name, toView, item, code) {
      this.setData({
        [name]: item.name,
        [code]: item.code,
        cityCode: item.code,
        toView
      })
    },
    // 向tabArr中添加'请选择'元素
    addItemToTabArr(tabArr, selectedTab) {
      tabArr.push({
        name: '请选择',
        level: selectedTab + 1,
        code: ''
      })
      this.setData({
        tabArr,
        selectedTab: selectedTab + 1
      })
    },
    // 修改选中的城市，对tabArr和城市列表进行修改
    setTabArr() {
      const {selectedTab, tabArr} = this.data
      if (selectedTab < tabArr.length - 1) {
        tabArr.splice(selectedTab + 1, tabArr.length - 1)
        this.setData({
          tabArr
        })
      }
    },
    // 当有搜索数据时，设置toView和cityCode
    setToviewAndCityCode(item) {
      const toView = `id${item.code}`
      this.setData({
        toView,
        cityCode: item.code
      })
    },
    // 切换城市tab时定位toView
    getToView(tab) {
      const {level, code} = tab
      const cityColumns = this.data.citys[level]
      if (!cityColumns) {
        // this.setData({
        //   citys: {}
        // })
        // if (level) {
        //   const item = this.data.searchCity[level - 1]
        //   this.triggerEvent('getColumnValue', item)
        // } else {
        //   this.triggerEvent('getColumnValue')
        // }
      } else {
        this.setData({
          toView: `id${code}`,
          cityCode: code
        })
      }
    },
    // 清空citys中元素的toView属性
    clearToView() {
      this.setData({
        toView: ''
      })
    },
    // 当选中搜索后的城市后，城市列表的变化
    cityChangeBySearchCity(item) {
      const {selectedTab, tabArr} = this.data
      const toView = `id${item.code}`
      const name = 'tabArr[' + selectedTab + '].name'
      if (this.addItemToEnd(name, toView, item)) {
        return
      }
      this.addItemToTabArr(tabArr, selectedTab)
      this.updateTabArr(selectedTab, item, toView, tabArr, name)
    },
    // 清空搜索城市结果数据
    clearSearchCity() {
      this.triggerEvent('clearSearchCity')
    }
  }
})
