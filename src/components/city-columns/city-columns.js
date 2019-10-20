Component({
  properties: {
    // 城市列表数据发生变化
    cityColumns: {
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
              hotCity,
              citys
            } = this.data
            if (searchCity.length > 0) {
              const level = selectedTab
              const tabItem = searchCity[level]
              this.setToviewAndCityCode(tabItem)
            }
            if (hotCity.name && ((citys.length - 1) > selectedTab)) {
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
    hotCity: {
      type: Object,
      value: {},
      observer(newVal) {
        if (Object.keys(newVal).length > 0) {
          this.clearToView()
          this.clearSearchCity()
          let {tabArr, selectedTab} = this.data
          tabArr = [
            {
              name: '省/直辖市',
              level: 0
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
            name: this.data.areaType,
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
    areaType: {
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
            level: 0
          }
        ]
        this.setData({
          tabArr,
          selectedTab: 0,
          toView: '',
          cityCode: ''
        })
      }
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
      const index = e.target.dataset.level
      this.setData({
        selectedTab: index
      })
      this.getToView(index)
      // 有搜索数据时切换tab
      const {selectedTab, searchCity} = this.data
      if (searchCity.length > 0) {
        const name = 'tabArr[' + selectedTab + '].name'
        const level = 'tabArr[' + selectedTab + '].level'
        this.setTabArr(name, level, searchCity[index])
      }
    },
    // 选中城市列表中具体的城市
    slecteItem(e) {
      const {selectedTab, tabArr} = this.data
      const item = e.target.dataset.item
      const toView = `id${e.target.dataset.item.code}`
      const name = 'tabArr[' + selectedTab + '].name'
      const level = 'tabArr[' + selectedTab + '].level'
      if (this.data.searchCity.length > 0) {
        const searchCity = this.data.searchCity
        searchCity.splice(selectedTab, 1, item)
        this.triggerEvent('changeSearchCity', searchCity)
        if (!selectedTab) {
          this.clearSearchCity()
        }
      }
      // 对选中的城市对象添加toView属性
      this.setToView(selectedTab, item.code, toView)
      this.setTabArr(name, level, item)
      if (this.addItemToEnd(name, toView, item)) {
        return
      }
      this.addItemToTabArr(tabArr, selectedTab)
      this.updateTabArr(selectedTab, item, toView, tabArr, name)
      // 触发选中的事件
      this.triggerEvent('getColumnValue', item)
      if (item.groupCode !== '2') {
        this.triggerEvent('clearHotselected', selectedTab)
      }
    },
    addItem(name, toView, item) {
      this.setData({
        [name]: item.name,
        cityCode: item.code,
        toView
      })
    },
    // 根据空运/速递/国内/国际判断选择的层级
    addItemToEnd(name, toView, item) {
      // 如果是国际
      if (item.groupCode === '2') {
        if (item.level > 1) {
          this.addItem(name, toView, item)
          return true
        }
      } else {
        // 如果是空运
        if (item.addressType === 1) {
          if (item.level > 2) {
            this.addItem(name, toView, item)
            return true
          }
        } else {
          if (item.level > 3) {
            this.addItem(name, toView, item)
            return true
          }
        }
      }
      return false
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
    // 当有搜索数据时，设置toView和cityCode
    setToviewAndCityCode(item) {
      const toView = `id${item.code}`
      this.setData({
        toView,
        cityCode: item.code
      })
    },
    // 为城市选项添加toView属性
    setToView(selectedTab, code, toView) {
      const cityColumns = this.data.citys[selectedTab]
      if (cityColumns) {
        cityColumns.forEach(city => {
          if (city.code === code) {
            city.toView = toView
          }
        })
      }
    },
    // 切换城市tab时定位toView
    getToView(level) {
      const cityColumns = this.data.citys[level]
      if (!cityColumns) {
        this.setData({
          citys: {}
        })
        if (level) {
          const item = this.data.searchCity[level - 1]
          this.triggerEvent('getColumnValue', item)
        } else {
          this.triggerEvent('getColumnValue')
        }
      } else {
        cityColumns.forEach(city => {
          if ('toView' in city) {
            this.setData({
              toView: city.toView,
              cityCode: city.code
            })
          }
        })
      }
    },
    // 清空citys中元素的toView属性
    clearToView() {
      const {citys} = this.data
      if (citys.length > 0) {
        for (const cityColumns of citys) {
          if (cityColumns) {
            cityColumns.forEach(city => {
              if ('toView' in city) {
                delete city.toView
              }
            })
          }
        }
      }
      this.setData({
        citys
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
