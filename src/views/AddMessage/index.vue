<template>
  <div class="components-container">
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">添加消息</el-card>
    <el-form label-width="120px" style="margin: 8px">
      <el-form-item label="ID1" style="text-align: left"><el-input v-model="id1" placeholder="请输入发送方id"/></el-form-item>
      <el-form-item label="ID2" style="text-align: left"><el-input v-model="id2" placeholder="请输入接收方id"/></el-form-item>
      <el-form-item label="发送时间" style="text-align: left">{{ adddate }}</el-form-item>
      <el-form-item label="所在地" style="text-align: left"><el-input v-model="location" placeholder="请输入所在地"/></el-form-item>
      <el-form-item label="机型" style="text-align: left"><el-input v-model="model" placeholder="请输入机型"/></el-form-item>
      <el-form-item label="消息内容"><el-input v-model="msg" :autosize="{ minRows: 5, maxRows: 10}" type="textarea" placeholder="请输入消息内容"/></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addMessage">添加消息</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'AddMessage',
  data() {
    return {
      id1: '',
      id2: '',
      adddate: '',
      location: '',
      model: '',
      msg: ''
    }
  },
  created() {
    var tdate = new Date()
    this.id = Math.floor(Math.random() * 100000) + 1
    this.adddate = this.formatTime(tdate)
  },
  methods: {
    addMessage() {
      var that = this
      axios.post('/server/addMessage/', qs.stringify({
        id1: that.id1,
        id2: that.id2,
        time: that.adddate,
        location: that.location,
        model: that.model,
        msg: that.msg
      })).then(function(res) {
        that.$notify({
          type: 'success',
          message: '添加成功!'
        })
        that.id1 = ''
        that.id2 = ''
        that.location = ''
        that.model = ''
        that.msg = ''
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
    }
  }
}
</script>

<style scoped>
  .components-container {
    text-align: center;
  }
</style>
