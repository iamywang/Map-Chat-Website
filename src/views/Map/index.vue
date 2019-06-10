<template>
  <div>
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">地图</el-card>
    <el-col :span="1" style="margin: 8px">
      <el-tag style="width: 100%; text-align: center">id</el-tag>
    </el-col>
    <el-col :span="4" style="margin: 8px">
      <el-input v-model="id" placeholder="请输入id" size="small"/>
    </el-col>
    <el-col :span="1" style="margin: 8px">
      <el-tag style="width: 100%; text-align: center">时间</el-tag>
    </el-col>
    <el-col :span="6" style="margin: 8px">
      <el-input v-model="time" placeholder="请输入时间" size="small"/>
    </el-col>
    <el-col :span="1" style="margin: 8px">
      <el-tag style="width: 100%; text-align: center">位置</el-tag>
    </el-col>
    <el-col :span="6" style="margin: 8px">
      <el-input v-model="location" placeholder="请输入位置" size="small"/>
    </el-col>
    <el-col :span="2" style="margin: 8px">
      <el-button size="small" @click="addLocation">添加</el-button>
    </el-col>
    <div id="container" style="margin-left: 2%; width:96%; height:510px"/>
  </div>
</template>

<script>
import AMap from 'AMap'
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      list: [],
      listLoading: true,
      id: '1',
      time: '',
      location: '',
      map: ''
    }
  },
  mounted() {
    var that = this
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 11
    })
    this.fetchData()
    AMap.plugin('AMap.Geolocation', function() {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 1000,
        buttonPosition: 'RB',
        buttonOffset: new AMap.Pixel(10, 20),
        zoomToAccuracy: false
      })
      that.map.addControl(geolocation)
    })
    var traffic = new AMap.TileLayer.Traffic({
      'autoRefresh': true,
      'interval': 1
    })
    this.map.addControl(new AMap.Scale({ visible: true }))
    this.map.addControl(new AMap.ToolBar({ visible: true }))
    this.map.addControl(new AMap.OverView({ visible: true }))
    this.map.add(traffic)
    this.map.on('click', function(e) {
      that.location = e.lnglat.getLat() + ',' + e.lnglat.getLng()
      that.time = that.formatTime(new Date())
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var that = this
      axios.get('/server/getLocations/', {
        params: {
          key: 'web'
        }
      }).then(function(res) {
        that.list = res.data
        that.listLoading = false
        for (var item in res.data) {
          var lat = res.data[item].location.split(',')[0]
          var lng = res.data[item].location.split(',')[1]
          var marker = new AMap.Marker({
            position: [lng, lat],
            title: 'ID：' + res.data[item].id + '  时间：' + res.data[item].time
          })
          that.map.add(marker)
        }
      })
    },
    formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },
    formatTime(date) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()

      var hour = date.getHours()
      var minute = date.getMinutes()
      var seconds = date.getSeconds()

      return [year, month, day].join('.') + ' ' + [hour, minute, seconds].map(this.formatNumber).join(':')
    },
    addLocation() {
      var that = this
      axios.post('/server/addLocation/', qs.stringify({
        id: that.id,
        road: 0,
        time: that.time,
        location: that.location
      })).then(function(res) {
        that.$notify({
          type: 'success',
          message: '添加成功!'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
