<template>
  <div>
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">地图</el-card>
    <el-col :span="1" style="margin: 8px">
      <el-tag style="width: 100%; text-align: center">id</el-tag>
    </el-col>
    <el-col :span="4" style="margin: 8px">
      <el-input v-model="id" placeholder="请输入id" size="small"/>
    </el-col>
    <el-col :span="2" style="margin: 8px">
      <el-button size="small" @click="searchGPS">查询</el-button>
    </el-col>
    <div id="container" style="margin-left: 2%; width:96%; height:520px"/>
  </div>
</template>

<script>
import AMap from 'AMap'
// import AMapUI from 'AMapUI'
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      id: '1',
      time: '',
      location: '',
      map: ''
    }
  },
  mounted() {
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 11
    })
    var traffic = new AMap.TileLayer.Traffic({
      'autoRefresh': true,
      'interval': 1
    })
    this.map.addControl(new AMap.Scale({ visible: true }))
    this.map.add(traffic)
  },
  methods: {
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
    addRoad(list) {
      var polyline = new AMap.Polyline({
        path: list,
        borderWeight: 2,
        lineJoin: 'round',
        lineCap: 'round'
      })
      this.map.add(polyline)
    },
    searchGPS() {
      var that = this
      axios.post('/server/getHistoryRoadList/', qs.stringify({
        id: that.id
      })).then(function(res) {
        for (var item in res.data) {
          axios.post('/server/getHistoryRoad/', qs.stringify({
            id: that.id,
            road: res.data[item].road
          })).then(function(res) {
            var LatlngList = []
            for (var loc in res.data) {
              var lat = res.data[loc].location.split(',')[0]
              var lng = res.data[loc].location.split(',')[1]
              var l = new AMap.LngLat(lng, lat)
              LatlngList.push(l)
            }
            that.addRoad(LatlngList)
            that.$notify({
              type: 'success',
              message: '查询成功!'
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
