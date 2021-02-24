<template>
    <div class="container">
            
            <div class="box">
                <quill-editor ref="" v-model="data" class="wenben"></quill-editor>
            </div>
            <div class="btn">
                <el-button @click="getWords()">取 消</el-button>
                <el-button type="primary" @click="editWords()">修改</el-button>
            </div>

    </div>
</template>


<script>
export default {
    data () {
        return {
            data:'',
            addVisible:false,
        }
    },
    methods:{
        getWords:function () {
            let url = "api/sendwords/get"
            let data = {
                sendWordId : 1
            }
            this.$Axios({
                url : url,
                method : 'post',
                data : data,
                header : {
                    'Content-Type' : 'application/json;charset=utf-8'
                }
            }).then(res => {
                console.log(res.data.data.content)
                this.data = res.data.data.content //返回的data可以直接用
            }).catch(err => {console.log(err)})
        },
        editWords:function () {
            console.log(this.data)
            let url = "api/sendwords/edit"
            let data = {
                content:this.data
            }
            this.$Axios({
                url : url,
                method : 'post',
                data : data,
                header : {
                    'Content-Type' : 'application/json;charset=utf-8'
                }
            }).then(res => {
               this.$notify({
                        message: "修改成功！",
                        type: "success",
                        duration:500
                    });
                // console.log("修改成功！")
            }).catch(err => {console.log(err)})
        }
    },
    mounted(){
        this.getWords();
    }
}
</script>


<style scoped>
.container{
    width: 100%;
    height: 600px;
}
.box{
    width: 90%;
    height: 400px;
    margin: auto;
}
.wenben{
    width: 100%;
    height: 400px;
}
.btn{
    margin-top:100px;
}
</style>