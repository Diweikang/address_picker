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
    cityColumns: [],
    // 选中的热门城市
    selectedCity: {},
    // 搜索的城市列表
    searchCitys: [],
    // 选中的搜索城市
    searchCity: [],
    // 城市列表tab第一项默认值
    areaType: '省/直辖市',
    // 区分内地和国际
    code: '0',
    title: '原寄地',
    active: '内地',
    // 城市列表开始请求的层级
    minLevel: 2,
    // 城市列表最多请求层级
    maxLevel: 3,
    // 热门城市选中的name
    selectedName: ''
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
    this.getCityColumns({type: 2, addressType: 2, groupCode: 0, level: 2})
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
    get('/api/v1/areas/search/group', data).then(res => {
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
    get('/api/v1/areas/search', data).then(res => {
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
    get('/api/v1/areas/search', data).then(res => {
      this.data.cityColumns = res
      this.setData({
        cityColumns: this.data.cityColumns
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
    return get('/api/v1/areas/search', data).then(res => {
      this.data.searchCitys = res
      this.setData({
        searchCitys: this.data.searchCitys
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
        minLevel: 2,
        maxLevel: 3
      })
    } else if (detail.code === '2') {
      this.setData({
        areaType: '国家',
        minLevel: 1,
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
  getColumnValue(data, isSearch=true) {
    if (!isSearch) {
      // let addressType = isSearch ? data.detail.addressType : data.addressType
      let addressType = 2
      let groupCode = isSearch ? data.detail.groupCode : data.groupCode
      let level = isSearch ? data.detail.level + 1 : data.level + 1
      let parentCode = isSearch ? data.detail.code : data.code
      this.getCityColumns({type: 2, addressType, groupCode, level, parentCode})
    } else {
      if (!data.detail) {
        this.getCityColumns({type: 2, addressType: 2, groupCode: 0, level: 2})
      } else {
        // let addressType = isSearch ? data.detail.addressType : data.addressType
        let addressType = 2
        let groupCode = isSearch ? data.detail.groupCode : data.groupCode
        let level = isSearch ? data.detail.level + 1 : data.level + 1
        let parentCode = isSearch ? data.detail.code : data.code
        this.getCityColumns({type: 2, addressType, groupCode, level, parentCode})
      }
    }
  },
  // 当选中热门城市时
  selectHotCity(data) {
    this.setData({
      selectedCity: data.detail,
      selectedName: data.detail.name,
      maxLevel: 2
    })
    this.getColumnValue(data)
  },
  // 清空热门城市的选中
  clearHotChecked(data) {
    if (!data.detail) {
      this.setData({
        selectedCity: [],
        selectedName: ''
      })
    }
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
      searchCitys: [],
      cityColumns: []
    })
  },
  // 选中搜索结果项触发的事件
  selectSearch(data) {
    this.setData({
      searchCity: data.detail
    })
    this.getColumnValue(data.detail[data.detail.length - 1], false)
  },
  // 清空搜索城市结果数据
  clearSearchCity() {
    this.setData({
      searchCity: []
    })
  },
  changeSearchCity(data) {
    this.setData({
      searchCity: data.detail
    })
  }
})
