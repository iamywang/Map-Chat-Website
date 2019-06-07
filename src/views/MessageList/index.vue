<template>
  <div class="app-container">
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">消息管理</el-card>
    <el-row>
      <el-col :span="6" style="margin: 8px">
        <el-input v-model="searchItem" placeholder="请输入内容" size="small">
          <el-button slot="append" size="small" icon="el-icon-search" />
        </el-input>
      </el-col>
      <el-col :span="4" style="margin: 8px">
        <el-button type="plain" size="small" icon="el-icon-plus" @click="addMessage">添加新消息</el-button>
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
      <el-table-column align="center" type="index"/>
      <el-table-column align="center" sortable label="ID1" prop="id1"/>
      <el-table-column align="center" label="用户1昵称" prop="nick1"/>
      <el-table-column align="center" sortable label="ID2" prop="id2"/>
      <el-table-column align="center" label="用户2昵称" prop="nick2"/>
      <el-table-column align="center" label="时间" prop="time"/>
      <el-table-column align="center" label="是否已读" prop="read"/>
      <el-table-column align="center" label="消息内容" prop="msg"/>
      <el-table-column align="center" label="选项">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)"/>
            <el-dialog :visible.sync="dialogFormVisible" title="编辑消息">
              <el-form label-width="120px" style="margin: 8px">
                <el-form-item label="id1" style="text-align: left">{{ id1 }}</el-form-item>
                <el-form-item label="昵称" style="text-align: left">{{ nick1 }}</el-form-item>
                <el-form-item label="id2" style="text-align: left">{{ id2 }}</el-form-item>
                <el-form-item label="昵称" style="text-align: left">{{ nick2 }}</el-form-item>
                <el-form-item label="时间" style="text-align: left">{{ time }}</el-form-item>
                <el-form-item label="位置"><el-input v-model="location" placeholder="请输入位置"/></el-form-item>
                <el-form-item label="机型"><el-input v-model="model" placeholder="请输入机型"/></el-form-item>
                <el-form-item label="消息内容"><el-input v-model="msg" :autosize="{ minRows: 5, maxRows: 10}" type="textarea" placeholder="请输入消息内容"/></el-form-item>
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
      id1: '',
      id2: '',
      nick1: '',
      nick2: '',
      time: '',
      location: '',
      model: '',
      msg: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var that = this
      axios.get('/server/getMessages/', {
        params: {
          key: 'all'
        }
      }).then(function(res) {
        that.list = res.data
        that.listLoading = false
      })
    },
    addMessage() {
      this.$router.push({ path: '/msg/func3' })
    },
    edit(res) {
      this.dialogFormVisible = true
      this.id1 = res.id1
      this.id2 = res.id2
      this.nick1 = res.nick1
      this.nick2 = res.nick2
      this.time = res.time
      this.location = res.location
      this.model = res.model
      this.msg = res.msg
    },
    del(res) {
      this.id1 = res.id1
      this.id2 = res.id2
      this.time = res.time
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
      axios.post('/server/updateMessage/', qs.stringify({
        id1: that.id1,
        id2: that.id2,
        time: that.time,
        location: that.location,
        model: that.model,
        msg: that.msg
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
      axios.post('/server/deleteMessage/', qs.stringify({
        id1: that.id1,
        id2: that.id2,
        time: that.time
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

      return [year, month, day].join('.') + ' ' + [hour, minute, seconds].map(this.formatNumber).join(':')
    }
  }
}
</script>
