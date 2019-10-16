import {get} from '../../api/city.js'
Page({
  data: {
    groups: [],
    hotCitys: [],
    cityColumns: [],
    hotCity: {},
    isShowSearch: true,
    searchCitys: [],
    searchCity: {}
  },
  onLoad() {
    this.getGroup()
    this.getHotCity({type: 2, addressType: 2})
    this.getCityColumns({type: 2, addressType: 2, groupCode: 0, level: 2})
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
  getHotCity({type, addressType, isHot = true, pageSize = 10}) {
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
  getCityColumns({type, addressType, groupCode, level, isHot = false, pageSize = 10, parentCode=''}) {
    let data = {
      isHot,
      pageSize,
      type,
      groupCode,
      level,
      addressType,
      parentCode
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
    console.log(data)
  },
  // 选中的城市
  getColumnValue(data) {
    console.log(33333333333333333)
    let addressType = data.addressType
    let groupCode = data.groupCode
    let level = data.level + 1
    let parentCode = data.code
    this.getCityColumns({type: 2, addressType, groupCode, level, parentCode})
  },
  // 当选中热门城市时
  selectHotCity(data) {
    this.setData({
      hotCity: data.detail
    })
    this.getColumnValue(data.detail)
  },
  // 清空热门城市的选中
  clearHotChecked(data) {
    if (data.detail == 0) {
      this.selectComponent("#hotCity").clearSelected()
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
      isShowSearch: data.detail
    })
  },
  // 选中搜索结果项触发的事件
  selectSearch(data) {
    this.setData({
      searchCity: data.detail
    })
    this.getColumnValue(data.detail.parents[1])
    // this.getColumnValue(data.detail)
  }
})
