<template>
  <div>
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">历史轨迹</el-card>
    <el-col :span="17">
      <div id="container" style="height:550px"/>
    </el-col>
    <el-col :span="7">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        stripe
        border
        fit
        highlight-current-row
        style="margin-left: 1%; margin-right: 1%">
        <el-table-column align="center" sortable label="ID" prop="id"/>
        <el-table-column align="center" label="路径标识" prop="road"/>
        <el-table-column align="center" label="选项">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="searchGPS(scope.row)"/>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
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
      list: [],
      listLoading: true,
      id: '1',
      map: ''
    }
  },
  mounted() {
    var that = this
    this.fetchData()
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 11
    })
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
  },
  methods: {
    fetchData(map) {
      this.listLoading = true
      var that = this
      axios.post('/server/getHistoryRoadList/', qs.stringify({
        id: 100000
      })).then(function(res) {
        that.list = res.data
        that.listLoading = false
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
    addRoad(list) {
      var polyline = new AMap.Polyline({
        path: list,
        borderWeight: 2,
        lineJoin: 'round',
        lineCap: 'round',
        isOutline: true,
        outlineColor: '#ffffff',
        strokeColor: '#0080ff',
        showDir: true
      })
      this.map.add(polyline)
      this.map.setFitView([polyline])
      var startIcon = new AMap.Icon({
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        imageSize: new AMap.Size(135, 40),
        imageOffset: new AMap.Pixel(-9, -3)
      })
      var startMarker = new AMap.Marker({
        position: list[0],
        icon: startIcon,
        offset: new AMap.Pixel(-13, -30)
      })
      this.map.add(startMarker)
      var endIcon = new AMap.Icon({
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        imageSize: new AMap.Size(135, 40),
        imageOffset: new AMap.Pixel(-95, -3)
      })
      var endMarker = new AMap.Marker({
        position: list[list.length - 1],
        icon: endIcon,
        offset: new AMap.Pixel(-13, -30)
      })
      this.map.add(endMarker)
    },
    searchGPS(res) {
      var that = this
      axios.post('/server/getHistoryRoad/', qs.stringify({
        id: res.id,
        road: res.road
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
  }
}
</script>

<style scoped>

</style>
