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
    <div id="container" style="margin-left: 2%; width:96%; height:520px"/>
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
      location: ''
    }
  },
  mounted() {
    var that = this
    var map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 11
    })
    map.on('click', function(e) {
      that.location = e.lnglat.getLat() + ',' + e.lnglat.getLng()
      that.time = that.formatTime(new Date())
    })
    var traffic = new AMap.TileLayer.Traffic({
      'autoRefresh': true,
      'interval': 1
    })
    map.addControl(new AMap.Scale({ visible: true }))
    map.add(traffic)
    // this.fetchData(map)
  },
  methods: {
    fetchData(map) {
      this.listLoading = true
      var that = this
      axios.get('/server/getLocations/', {
        params: {
          key: 'all'
        }
      }).then(function(res) {
        that.list = res.data
        that.listLoading = false
        // for (var item in that.list) {
        //   var lat = item.location.split(',')[0]
        //   var lng = item.location.split(',')[1]
        //   that.addMarkerLoc(map, lat, lng)
        // }
      })
    },
    addMarkerLoc(nmap, lat, lng) {
      var marker = new AMap.Marker({
        map: nmap,
        position: [lng, lat]
      })
      nmap.addMarker(marker)
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
