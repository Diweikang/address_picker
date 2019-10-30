Component({
  properties: {
    // 城市列表数据
    columns: {
      type: Object,
      value: {}
    },
    // 被激活的城市
    active: {
      type: String,
      value: ''
    },
    // 点击后城市移动的位置
    toView: {
      type: String,
      value: ''
    },
    // 城市列表的tabs
    tabs: {
      type: Array,
      value: []
    },
    // 选中的城市tab
    selectedTab: {
      type: Number,
      value: 0
    }
  },
  methods: {
    // 切换城市列表tab操作
    changeTab(e) {
      const tab = e.target.dataset.item
      this.triggerEvent('change', tab)
    },
    // 选中城市列表中具体的城市，并返回选中的城市
    slecteItem(e) {
      const item = e.target.dataset.item
      this.triggerEvent('getColumnValue', item)
    },
    // 点击确定时，触发的事件
    confirm() {
      this.triggerEvent('confirm')
    }
  }
})
