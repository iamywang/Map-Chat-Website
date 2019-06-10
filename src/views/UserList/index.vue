<template>
  <div class="app-container">
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">用户管理</el-card>
    <el-row>
      <el-col :span="6" style="margin: 8px">
        <el-input v-model="searchItem" placeholder="请输入内容" size="small">
          <el-button slot="append" size="small" icon="el-icon-search" />
        </el-input>
      </el-col>
      <el-col :span="4" style="margin: 8px">
        <el-button type="plain" size="small" icon="el-icon-plus" @click="addUser">添加用户</el-button>
        <el-dialog :visible.sync="registerFormVisible" title="注册新用户">
          <el-form label-width="120px" style="margin: 8px">
            <el-form-item label="ID">{{ id }}</el-form-item>
            <el-form-item label="昵称"><el-input v-model="nick" placeholder="请输入昵称"/></el-form-item>
            <el-form-item label="性别" style="text-align: left"><el-input v-model="sex" placeholder="请输入性别（男/女）"/></el-form-item>
            <el-form-item label="生日" style="text-align: left"><el-input v-model="birth" placeholder="请输入生日"/></el-form-item>
            <el-form-item label="身高" style="text-align: left"><el-input v-model="height" placeholder="请输入身高"/></el-form-item>
            <el-form-item label="体重" style="text-align: left"><el-input v-model="weight" placeholder="请输入体重"/></el-form-item>
            <el-form-item label="注册时间">{{ regdate }}</el-form-item>
            <el-form-item label="最后登录时间">{{ logindate }}</el-form-item>
            <el-form-item>
              <el-button @click="registerFormVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmAddUser">确定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      stripe
      border
      fit
      highlight-current-row>
      <el-table-column align="center" type="expand">
        <template slot-scope="scope">
          <el-col :span="6">
            <el-row>
              <el-tag style="margin-bottom: 8px">用户id</el-tag>
              <span>{{ scope.row.id }}</span>
            </el-row>
            <el-row>
              <el-tag style="margin-bottom: 8px">用户昵称</el-tag>
              <span>{{ scope.row.name }}</span>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-tag style="margin-bottom: 8px">用户生日</el-tag>
              <span>{{ scope.row.birth }}</span>
            </el-row>
            <el-row>
              <el-tag style="margin-bottom: 8px">用户性别</el-tag>
              <span>{{ scope.row.sex }}</span>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-tag style="margin-bottom: 8px">身高</el-tag>
              <span>{{ scope.row.height }} cm</span>
            </el-row>
            <el-row>
              <el-tag style="margin-bottom: 8px">体重</el-tag>
              <span>{{ scope.row.weight }} kg</span>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-tag style="margin-bottom: 8px">在线状态</el-tag>
              <span>{{ scope.row.online }}</span>
            </el-row>
            <el-row>
              <el-tag style="margin-bottom: 8px">好友数</el-tag>
              <span>{{ scope.row.friends }}</span>
            </el-row>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column align="center" type="index"/>
      <el-table-column align="center" sortable label="ID" prop="id"/>
      <el-table-column align="center" label="用户昵称" prop="name"/>
      <el-table-column align="center" label="性别" prop="sex"/>
      <el-table-column align="center" label="在线状态" prop="online"/>
      <el-table-column align="center" sortable label="注册时间" prop="reg"/>
      <el-table-column align="center" sortable label="最后登录时间" prop="login"/>
      <el-table-column align="center" label="选项">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)"/>
            <el-dialog :visible.sync="dialogFormVisible" title="编辑用户">
              <el-form label-width="120px" style="margin: 8px">
                <el-form-item label="昵称"><el-input v-model="nick" placeholder="请输入昵称"/></el-form-item>
                <el-form-item label="性别" style="text-align: left"><el-input v-model="sex" placeholder="请输入性别（男/女）"/></el-form-item>
                <el-form-item label="生日" style="text-align: left"><el-input v-model="birth" placeholder="请输入生日"/></el-form-item>
                <el-form-item label="身高" style="text-align: left"><el-input v-model="height" placeholder="请输入身高"/></el-form-item>
                <el-form-item label="体重" style="text-align: left"><el-input v-model="weight" placeholder="请输入体重"/></el-form-item>
                <el-form-item label="在线状态" style="text-align: left">{{ online }}</el-form-item>
                <el-form-item label="注册时间" style="text-align: left">{{ regdate }}</el-form-item>
                <el-form-item label="最后登录时间" style="text-align: left">{{ logindate }}</el-form-item>
                <el-form-item>
                  <el-button @click="dialogFormVisible = false">取消</el-button>
                  <el-button type="primary" @click="confirmEdit">确定</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row)"/>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :total="10" background layout="prev, pager, next" style="float: right"/>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  data() {
    return {
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      registerFormVisible: false,
      id: '',
      nick: '',
      sex: '',
      birth: '',
      height: '',
      weight: '',
      online: '',
      regdate: '',
      logindate: '',
      searchItem: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var that = this
      axios.get('/server/getUsers/', {
        params: {
          key: 'all'
        }
      }).then(function(res) {
        that.list = res.data
        that.listLoading = false
      })
    },
    addUser() {
      this.registerFormVisible = true
      this.id = Math.floor(Math.random() * 100000) + 1
      var tdate = new Date()
      this.regdate = this.formatTime(tdate)
      this.logindate = this.formatTime(tdate)
    },
    confirmAddUser() {
      var that = this
      axios.post('/server/insertUser/', qs.stringify({
        id: that.id,
        name: that.nick,
        sex: that.sex,
        birth: that.birth,
        height: that.height,
        weight: that.weight,
        reg: that.regdate,
        login: that.logindate
      })).then(function(res) {
        that.$notify({
          type: 'success',
          message: '添加成功!'
        })
        that.nick = ''
        that.registerFormVisible = false
        that.fetchData()
      })
    },
    edit(res) {
      this.dialogFormVisible = true
      this.id = res.id
      this.nick = res.name
      this.sex = res.sex
      this.birth = res.birth
      this.height = res.height
      this.weight = res.weight
      this.online = res.online
      this.regdate = res.reg
      this.logindate = res.login
    },
    del(res) {
      this.id = res.id
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmDel()
        this.$notify({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    confirmEdit() {
      var that = this
      axios.post('/server/updateUser/', qs.stringify({
        id: that.id,
        name: that.nick,
        sex: that.sex,
        birth: that.birth,
        height: that.height,
        weight: that.weight,
        reg: that.regdate,
        login: that.logindate
      })).then(function(res) {
        that.$notify({
          type: 'success',
          message: '编辑成功!'
        })
        that.dialogFormVisible = false
        that.fetchData()
      })
    },
    confirmDel() {
      var that = this
      axios.post('/server/deleteUser/', qs.stringify({
        id: that.id
      })).then(function(res) {
        that.dialogFormVisible = false
        that.fetchData()
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

      return [year, month, day].join('-') + ' ' + [hour, minute, seconds].map(this.formatNumber).join(':')
    }
  }
}
</script>
