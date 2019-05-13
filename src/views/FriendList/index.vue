<template>
  <div class="app-container">
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">好友管理</el-card>
    <el-row>
      <el-col :span="6" style="margin: 8px">
        <el-input v-model="searchItem" placeholder="请输入内容" size="small">
          <el-button slot="append" size="small" icon="el-icon-search" />
        </el-input>
      </el-col>
      <el-col :span="4" style="margin: 8px">
        <el-button type="plain" size="small" icon="el-icon-plus" @click="addFriend">添加好友</el-button>
        <el-dialog :visible.sync="registerFormVisible" title="添加好友">
          <el-form label-width="120px" style="margin: 8px">
            <el-form-item label="id1" style="text-align: left"><el-input v-model="id1" placeholder="请输入id1"/></el-form-item>
            <el-form-item label="id2" style="text-align: left"><el-input v-model="id2" placeholder="请输入id2"/></el-form-item>
            <el-form-item label="添加时间" style="text-align: left">{{ adddate }}</el-form-item>
            <el-form-item>
              <el-button @click="registerFormVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmAddFriend">确定</el-button>
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
      <el-table-column align="center" type="index"/>
      <el-table-column align="center" sortable label="ID1" prop="id1"/>
      <el-table-column align="center" label="昵称1" prop="nick1"/>
      <el-table-column align="center" sortable label="ID2" prop="id2"/>
      <el-table-column align="center" label="昵称2" prop="nick2"/>
      <el-table-column align="center" label="添加时间" prop="adddate"/>
      <el-table-column align="center" label="选项">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)"/>
            <el-dialog :visible.sync="dialogFormVisible" title="编辑好友">
              <el-form label-width="120px" style="margin: 8px">
                <el-form-item label="id1" style="text-align: left">{{ id1 }}</el-form-item>
                <el-form-item label="nick1" style="text-align: left">{{ nick1 }}</el-form-item>
                <el-form-item label="id2" style="text-align: left"><el-input v-model="id2" placeholder="请输入id2"/></el-form-item>
                <el-form-item label="nick2" style="text-align: left">{{ nick2 }}</el-form-item>
                <el-form-item label="添加时间" style="text-align: left">{{ adddate }}</el-form-item>
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
      id1: '',
      id2: '',
      nick1: '',
      nick2: '',
      adddate: '',
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
      axios.get('/server/getFriends/', {
        params: {
          key: 'all'
        }
      }).then(function(res) {
        that.list = res.data
        that.listLoading = false
      })
    },
    addFriend() {
      this.registerFormVisible = true
      var tdate = new Date()
      this.adddate = this.formatTime(tdate)
    },
    confirmAddFriend() {
      var that = this
      axios.post('/server/addFriend/', qs.stringify({
        id1: that.id1,
        id2: that.id2,
        adddate: that.adddate
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
      this.id1 = res.id1
      this.nick1 = res.nick1
      this.id2 = res.id2
      this.nick2 = res.nick2
      this.adddate = res.adddate
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
      axios.post('/server/updateFriend/', qs.stringify({
        id1: that.id1,
        id2: that.id2
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
      axios.post('/server/deleteFriend/', qs.stringify({
        id1: that.id1,
        id2: that.id2
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
