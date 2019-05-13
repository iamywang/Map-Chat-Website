<template>
  <div class="components-container">
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">添加用户</el-card>
    <el-form label-width="120px" style="margin: 8px">
      <el-form-item label="ID" style="text-align: left">{{ id }}</el-form-item>
      <el-form-item label="昵称" style="text-align: left"><el-input v-model="nick" placeholder="请输入昵称"/></el-form-item>
      <el-form-item label="性别" style="text-align: left"><el-input v-model="sex" placeholder="请输入性别（男/女）"/></el-form-item>
      <el-form-item label="生日" style="text-align: left"><el-input v-model="birth" placeholder="请输入生日"/></el-form-item>
      <el-form-item label="身高" style="text-align: left"><el-input v-model="height" placeholder="请输入身高"/></el-form-item>
      <el-form-item label="体重" style="text-align: left"><el-input v-model="weight" placeholder="请输入体重"/></el-form-item>
      <el-form-item label="注册时间" style="text-align: left">{{ regdate }}</el-form-item>
      <el-form-item label="最后登录时间" style="text-align: left">{{ logindate }}</el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'AddUser',
  data() {
    return {
      id: '',
      nick: '',
      sex: '',
      birth: '',
      height: '',
      weight: '',
      regdate: '',
      logindate: ''
    }
  },
  created() {
    var tdate = new Date()
    this.id = Math.floor(Math.random() * 100000) + 1
    this.regdate = this.formatTime(tdate)
    this.logindate = this.formatTime(tdate)
  },
  methods: {
    addUser() {
      var that = this
      axios.post('/server/insertUser/', qs.stringify({
        id: that.id,
        name: that.nick,
        sex: that.sex,
        birth: that.birth,
        height: that.birth,
        weight: that.weight,
        reg: that.regdate,
        login: that.logindate
      })).then(function(res) {
        that.$notify({
          type: 'success',
          message: '添加成功!'
        })
        that.nick = ''
        that.sex = ''
        that.birth = ''
        that.height = ''
        that.weight = ''
        that.id = Math.floor(Math.random() * 100000) + 1
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

      return [year, month, day].join('.') + ' ' + [hour, minute].map(this.formatNumber).join(':')
    }
  }
}
</script>

<style scoped>
  .components-container {
    text-align: center;
  }
</style>
