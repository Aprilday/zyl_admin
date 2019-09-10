<template>
    <div style="width:100%;">
        <el-main style="padding-top:0;">
            <el-row style="margin-bottom: 20px;">
                <el-button @click="open()" type="success">新增</el-button>
                <el-button @click="search" type="primary">查询</el-button>
            </el-row>
            <el-table :data="tableData" border>
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="类别名称" prop="name"></el-table-column>
                <el-table-column label="是否展示" prop="isshow">
                    <template slot-scope="scope">
                        <div>{{scope.row.isshow | show}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="open(scope.row.id)">编辑</el-button>
                        <el-button v-if="scope.row.isshow === 1" size="mini" @click="hide(scope.row.id, 2)" type="danger">隐藏</el-button>
                        <el-button v-if="scope.row.isshow === 2" size="mini" @click="hide(scope.row.id, 1)" type="primary">显示</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog 
            :visible.sync="showDialogField" 
            width="70%"
            @close="close">
            <el-form ref="dialog" :model="dialog" label-width="100px">
                <el-form-item label="类别名称" prop="name">
                    <el-input v-model="dialog.name"></el-input>
                </el-form-item>
            </el-form>
            <el-row style="margin-top: 50px;text-align:center;"><el-button @click="showDialogField = false">取消</el-button><el-button type="primary" @click="sub">提交</el-button></el-row>
        </el-dialog>
    </div>
</template>
<script>
import request from '@/utils/request';
// const env = 'http://localhost:5050'
const env = ''
const APIS = {
    add: `${env}/admin/addCategory`,
    search: `${env}/admin/categoryList`,
    detail: `${env}/admin/categoryDetail`,
    edit: `${env}/admin/updateCategory`,
    hide: `${env}/admin/hideCategory`
}
export default {
    data() {
        return {
            tableData: [],
            showDialogField: false,
            dialog: {
                id: '',
                name: ''
            }
        }
    },
    filters: {
        show(val) {
            let res = '不显示'
            if (val === 1) {
                res = '显示'
            }
            return res;
        }
    },
    mounted() {
        this.search();
        
    },
    methods: {
        search() {
            setTimeout(() => {
                request('get', APIS.search, {}).then(res => {
                    this.tableData = res.data;
                })
            }, 500)
        },
        open(id) {
            this.showDialogField = true;
            if (id) {
                this.type = 'edit';
                request('post', APIS.detail, {id: id}).then(res => {
                    this.dialog = {
                        id: res.data[0].id,
                        name: res.data[0].name
                    }
                }).catch(() => {
                    this.$message.error('获取详情失败');
                })
            } else {
                this.type = 'add';
            }
        },
        hide(id, isshow) {
            this.$confirm('确定该操作么', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request('post', APIS.hide, {id: id, isshow: isshow}).then(res => {
                    if(res.result) {
                        this.search();
                        this.$message.success('操作成功');
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            }).catch(() => {});
        },
        getParam() {
            let param = {
                id: this.dialog.id,
                name: this.dialog.name
            }
            return param
        },
        sub() {
            let param = this.getParam();
            let url = APIS.add;
            if(this.type === 'edit') {
                url = APIS.edit;
            }
            request('post', url, param).then(res => {
                if(res.result) {
                    this.$message.success('操作成功');
                    this.showDialogField = false;
                    this.search();
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        close() {
            this.cleanData();
            this.$refs['dialog'].resetFields();
        },
        cleanData() {
            this.dialog = {
                id: '',
                name: ''
            }
        },
    }
}
</script>
<style scoped>
  
</style>