<template>
  <div class="app-container">
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">位置管理</el-card>
    <el-row>
      <el-col :span="6" style="margin: 8px">
        <el-input v-model="searchItem" placeholder="请输入内容" size="small">
          <el-button slot="append" size="small" icon="el-icon-search" />
        </el-input>
      </el-col>
      <el-col :span="4" style="margin: 8px">
        <el-button type="plain" size="small" icon="el-icon-plus" @click="addLocation">添加位置</el-button>
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
      <el-table-column align="center" sortable label="ID" prop="id"/>
      <el-table-column align="center" sortable label="时间" prop="time"/>
      <el-table-column align="center" label="位置" prop="location"/>
      <el-table-column align="center" label="选项">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)"/>
            <el-dialog :visible.sync="dialogFormVisible" title="编辑位置">
              <el-form label-width="120px" style="margin: 8px">
                <el-form-item label="id" style="text-align: left">{{ id }}</el-form-item>
                <el-form-item label="时间" style="text-align: left">{{ time }}</el-form-item>
                <el-form-item label="位置" style="text-align: left"><el-input v-model="location" placeholder="请输入位置"/></el-form-item>
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
      id: '',
      time: '',
      location: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var that = this
      axios.get('/server/getLocations/', {
        params: {
          key: 'all'
        }
      }).then(function(res) {
        that.list = res.data
        that.listLoading = false
      })
    },
    addLocation() {
      this.$router.push({ path: '/gps/func4' })
    },
    edit(res) {
      this.dialogFormVisible = true
      this.id = res.id
      this.time = res.time
      this.location = res.location
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
      axios.post('/server/updateLocation/', qs.stringify({
        id: that.id,
        time: that.time,
        location: that.location
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
      axios.post('/server/deleteLocation/', qs.stringify({
        id: that.id,
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

      return [year, month, day].join('-') + ' ' + [hour, minute, seconds].map(this.formatNumber).join(':')
    }
  }
}
</script>
