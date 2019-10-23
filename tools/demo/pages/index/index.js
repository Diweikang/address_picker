import {get} from '../../api/city.js'
Page({
  data: {
    // 显示对话框
    isShowDialog: true,
    // 显示搜索框
    isShowSearch: false,
    // 地区分组数据
    groups: [],
    // 热门城市数据
    hotCitys: [],
    // 城市列表数据
    cityColumns: {},
    // 选中的城市
    selectedCity: {},
    // 搜索的城市列表
    searchCitys: [],
    // 城市列表tab第一项默认值
    areaType: '省/直辖市',
    // 区分内地和国际
    code: '0',
    title: '原寄地',
    active: '内地',
    // 城市列表最多请求层级
    maxLevel: 3,
    // 热门城市选中的name
    selectedName: '',
    // 城市列表顶部tab
    tabArr: [
      {
        name: '省/直辖市',
        level: 0,
        code: ''
      }
    ],
    // 城市列表选中的tab
    selectedTab: 0,
    cityCode: '',
    toView: ''
  },
  onLoad() {
    /**
     * type: 1-目的地。 2-原寄地
     * addressType: 1-空运。 2-速递。
     * groupCode: 0-内地。 1-港澳台。 2-国际。
     * level: 表示从那一层开始请求数据。
     */
    // 初始化获取地区分组
    this.getGroup()
    // 初始化获取热门城市
    this.getHotCitys({type: 2, addressType: 2})
    // 初始化获取省/直辖市
    this.getCityColumns({type: 2, addressType: 2, groupCode: 0, level: 2}).then(data => {
      const cityColumnsItem = 'cityColumns[' + this.data.selectedTab + ']'
      this.setData({
        [cityColumnsItem]: data
      })
    })
  },
  // 点击展示对话框
  showDialog (e) {
    this.setData({
      isShowDialog: false,
      title: e.target.dataset.title 
    })
  },
  // 获取地区分组数据
  getGroup() {
    let data = {
      type: 2,
      addressType: 2,
      isProduct: true
    }
    get('/api/v1/product/areas/search/group', data).then(res => {
      this.data.groups = res
      this.setData({
        groups: this.data.groups
      })
    })
  },
  // 获取热门城市数据
  getHotCitys({type, addressType, isHot = true, pageSize = 10}) {
    let data = {
      isHot,
      pageSize,
      type,
      addressType
    }
    get('/api/v1/product/areas/search', data).then(res => {
      this.data.hotCitys = res
      this.setData({
        hotCitys: this.data.hotCitys
      })
    })
  },
  // 获取城市列表数据
  getCityColumns({type, addressType, groupCode, level, isHot = false, pageSize = 10, parentCode}) {
    let data = {
      isHot,
      pageSize,
      type,
      groupCode,
      level,
      addressType
    }
    if (parentCode) {
      data = Object.assign(data, {parentCode})
    }
    return get('/api/v1/product/areas/search', data).then(res => {
      return res.map(item => {
        return Object.assign(item, {id: item.code})
      })
    })
  },
  // 搜索城市
  querySearchCitys(searchData) {
    let data = {
      isHot: false,
      pageSize: 10,
      type: 2,
      addressType: 2,
      content: searchData.detail
    }
    return get('/api/v1/product/areas/search', data).then(res => {
      this.setData({
        searchCitys: res
      })
      return res
    })
  },
  // 绑定区域分组改变事件
  onChange(data) {
    const {detail} = data
    if (detail.code === '0') {
      this.setData({
        areaType: '省/直辖市',
        maxLevel: 3
      })
    } else if (detail.code === '2') {
      this.setData({
        areaType: '国家',
        maxLevel: 2
      })
    }
    this.setData({
      code: detail.code,
      active: detail.name
    })
    this.getCityColumns({type: 2, addressType: 2, groupCode: detail.code, level: 1})
  },
  // 选中的城市
  getColumnValue(data) {
    let {selectedTab} = this.data
    const {tabArr, maxLevel, selectedCity} = this.data
    if (selectedCity && !selectedTab) {
      this.setData({
        maxLevel: 3
      })
      this.clearHotChecked()
    }
    data.detail.type = 2
    data.detail.level += 1
    data.detail.parentCode = data.detail.code
    this.setTabArr()
    if (tabArr.length >= maxLevel) {
      this.addItem(data.detail, selectedTab)
    } else {
      this.getCityColumns(data.detail).then(res => {
        this.addItem(data.detail, selectedTab)
        selectedTab += 1
        const cityColumnsItem = 'cityColumns[' + selectedTab + ']'
        this.setData({
          [cityColumnsItem]: res,
          selectedTab,
          toView: res[0].id
        })
        this.addItemToTabArr(selectedTab)
      })
    }
  },
  // 向tabArr末尾添加'请选择'
  addItemToTabArr(selectedTab) {
    const {tabArr} = this.data
    tabArr.push({
      name: '请选择',
      level: selectedTab,
      code: ''
    })
    this.setData({
      tabArr
    })
  },
  // 将选中的城市赋值给tabArr
  addItem(item, selectedTab) {
    const name = 'tabArr[' + selectedTab + '].name'
    const code = 'tabArr[' + selectedTab + '].code'
    const level = 'tabArr[' + selectedTab + '].level'
    this.setData({
      [name]: item.name,
      [code]: item.code,
      [level]: selectedTab,
      cityCode: item.code,
      toView: item.code
    })
  },
  // 修改选中的城市，对tabArr和城市列表进行修改
  setTabArr() {
    const {selectedTab, tabArr, cityColumns} = this.data
    if (selectedTab < tabArr.length - 1) {
      tabArr.splice(selectedTab + 1, tabArr.length - 1)
      cityColumns.splice(selectedTab + 1, cityColumns.length - 1)
      this.setData({
        tabArr,
        cityColumns
      })
    }
  },
  // 当切换城市列表顶部tab时候
  changeTabArr(data) {
    const {detail} = data
    this.setData({
      cityCode: detail.code,
      toView: detail.code,
      selectedTab: detail.level
    })
  },
  // 当选中热门城市时
  selectHotCity(data) {
    data.detail.type = 2
    data.detail.level += 1
    data.detail.parentCode = data.detail.code
    let {tabArr, selectedTab, cityColumns} = this.data
    const {areaType} = this.data
    tabArr = [
      {
        name: areaType,
        level: 0,
        code: ''
      }
    ]
    selectedTab = 1
    this.setData({
      tabArr,
      selectedCity: data.detail,
      selectedName: data.detail.name,
      maxLevel: 2,
      selectedTab
    })
    this.addItemToTabArr(selectedTab)
    cityColumns.splice(selectedTab, cityColumns.length - 1)
    this.getCityColumns(data.detail).then(res => {
      const cityColumnsItem = 'cityColumns[' + selectedTab + ']'
      this.setData({
        [cityColumnsItem]: res
      })
    })
  },
  // 清空热门城市的选中
  clearHotChecked() {
    this.setData({
      selectedCity: {},
      selectedName: ''
    })
  },
  // 当点击搜索框时触发的事件
  showSearch(data) {
    this.setData({
      isShowSearch: data.detail
    })
  },
  // 当点击搜索页面的取消时，隐藏搜索页
  hideSearch(data) {
    this.setData({
      isShowSearch: data.detail,
      searchCitys: []
    })
  },
  // 选中搜索结果项触发的事件
  selectSearch(data) {
    // 初始化数据
    this.clearHotChecked()
    this.initData()
    let {selectedTab} = this.data
    let searchCitys = this.addTabArrBySearchCity(data)
    searchCitys.forEach(city => {
      city = this.formatDetail(city)
      this.getCityColumns(city).then(res => {
        this.addItem(city, selectedTab)
        selectedTab += 1
        const cityColumnsItem = 'cityColumns[' + selectedTab + ']'
        this.setData({
          [cityColumnsItem]: res,
          selectedTab
        })
        this.addItemToTabArr(selectedTab)
      })
    })
  },
  // 搜索后数据对tabArr修改
  addTabArrBySearchCity(data) {
    const {detail} = data
    let searchCitys = []
    searchCitys.push(detail.parents[1])
    searchCitys.push(detail)
    return searchCitys
  },
  // 初始化数据
  initData() {
    this.setData({
      tabArr: [],
      selectedTab: 0,
      cityCode: '',
      toView: ''
    })
  },
  formatDetail(detail) {
    detail.type = 2
    detail.level += 1
    detail.parentCode = detail.code
    return detail
  }
})
