<template>
  <div class="app-container">
    <el-card shadow="hover" style="text-align: center; margin: 8px; font-weight: bold">反馈管理</el-card>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      stripe
      border
      fit
      highlight-current-row>
      <el-table-column align="center" type="index"/>
      <el-table-column align="center" sortable label="用户id" prop="id"/>
      <el-table-column align="center" label="联系方式" prop="contact"/>
      <el-table-column align="center" label="反馈时间" prop="time"/>
      <el-table-column align="center" label="反馈内容" prop="text"/>
    </el-table>
    <el-pagination :total="10" background layout="prev, pager, next" style="float: right"/>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      list: [],
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var that = this
      axios.get('/server/getFeedback/', {
        params: {
          key: 'all'
        }
      }).then(function(res) {
        that.list = res.data
        that.listLoading = false
      })
    }
  }
}
</script>
