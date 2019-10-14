import {get} from '../../api/city.js'
Page({
  data: {
    groups: [],
    hotCitys: [],
    cityColumns: []
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
    return get('/api/v1/areas/search', data).then(res => {
      this.data.cityColumns = res
      this.setData({
        cityColumns: this.data.cityColumns
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
    let addressType = data.detail.addressType
    let groupCode = data.detail.groupCode
    let level = data.detail.level
    let parentCode = data.detail.code
    this.getCityColumns({type: 2, addressType, groupCode, level, parentCode}).then(res => {
      this.data.cityColumns = res
      this.setData({
        cityColumns: this.data.cityColumns
      })
    })
  }
})
