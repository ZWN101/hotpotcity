<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>

        <el-table :data="commentList.slice((currentPage - 1) * PageSize, currentPage * PageSize)" border style="width: 100%">
            <el-table-column fixed prop="nickName" label="用户昵称"></el-table-column>
            <el-table-column  label="评价星级" width="200">
                <template slot-scope="scope">
                    <el-rate v-model="scope.row.star" disabled></el-rate>
                </template>
            </el-table-column>
            <el-table-column prop="orderDate" label="订单日期"></el-table-column>
            <el-table-column prop="content" label="评价内容" > </el-table-column>
        </el-table>
          <!-- 分页 -->
        <div class="tabListPage">
         <el-pagination
         @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
         :page-sizes="pageSizes" 
        :page-size="PageSize"
        layout="total, prev, sizes,pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>
    <!-- 分页 -->
    </div>
</template>

<script>
export default {
    data(){
        return{
            comments:[],
            commentList:[],
            // 分页***************
            // 总数据
            tableData: [],
            // 个数选择器（可修改）
            pageSizes: [10, 20, 30, 40],
            // 默认显示第几页
            currentPage: 1, 
            // 总条数，根据接口获取数据长度(注意：这里不能为空)
             totalCount: 1,
            // 默认每页显示的条数（可修改）
            PageSize: 10,
        };
    },
    methods:{
        // 分页
       // 每页显示的条数
        handleSizeChange(val) {
         // 改变每页显示的条数
          this.PageSize = val;
         // 注意：在改变每页显示的条数时，要将页码显示到第一页
         this.currentPage = 1;
       },
        // 显示第几页
        handleCurrentChange(val) {
         // 改变默认的页数
         this.currentPage = val;
      },
        getsearch(){  
            var url = "api/comments/get" ;
            var data = {};
            this.$Axios({
                url : url,
                method : 'post',
                data : data,
                header : {
                    'Content-Type' : 'application/json;charset=utf-8'
                }
            }).then((res) => {
                // console.log(res);
                this.comments = res.data.data
                var comment = {};
                for(let i=0;i<this.comments.length;i++){

                    comment.nickName = this.comments[i].user.nickName;
                    comment.orderDate = this.comments[i].order.orderDate;
                    comment.star = Number(this.comments[i].comment.star);

                    comment.content = this.comments[i].comment.content;

                    this.commentList.push(comment);
                    comment = {};

                }
                this.totalCount = this.commentList.length;
                console.log(this.commentList);

            }).catch(err => {console.log(err)})

        }
    },
    mounted(){
        this.getsearch();
    }
}
</script>

<style scoped>

</style>