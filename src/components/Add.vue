<template>
    <div style="width:100%;">
        <el-main style="padding-top:0;">
            <el-row style="margin-bottom: 20px;">
                <el-button @click="open()" type="success">新增</el-button>
                <el-button @click="search" type="primary">查询</el-button>
            </el-row>
            <el-table :data="tableData" border>
                <el-table-column label="编号" prop="No"></el-table-column>
                <el-table-column label="类别" prop="name"></el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="是否展示" prop="isshow">
                    <template slot-scope="scope">
                        <div>{{scope.row.isshow | show}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="open(scope.row.No)">编辑</el-button>
                        <el-button v-if="scope.row.isshow === 1" size="mini" @click="hide(scope.row.No, 2)" type="danger">隐藏</el-button>
                        <el-button v-if="scope.row.isshow === 2" size="mini" @click="hide(scope.row.No, 1)" type="primary">显示</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog 
            :visible.sync="showDialogField" 
            width="70%"
            @close="close">
            <el-form ref="dialog" :model="dialog" label-width="100px">
                <el-form-item label="编号" prop="No">
                    <el-input v-model="dialog.No"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="category">
                    <el-select v-model="dialog.category">
                        <el-option 
                            v-for="(item, index) in Category" 
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="url">
                    <el-upload
                        class="avatar-uploader"
                        :action="env + '/admin/upload'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="dialog.url" :src="dialog.url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="dialog.price"></el-input>
                </el-form-item>
                <el-form-item :label="`规格${index + 1}`" v-for="(item, index) in dialog.backup" :key="index" size="mini">
                    <el-input v-model="dialog.backup[index].title" style="width: 80px;" placehodler="规格名称"></el-input>
                    <el-input v-model="dialog.backup[index].price" style="width: 80px;" placehodler="价格"></el-input>
                    <el-button icon="el-icon-plus" type="primary" @click="add"></el-button>
                    <el-button v-show="dialog.backup && dialog.backup.length > 1" icon="el-icon-minus" @click="minus(index)"></el-button>
                </el-form-item>
            </el-form>
            <el-row style="margin-top: 50px;text-align:center;"><el-button @click="showDialogField = false">取消</el-button><el-button type="primary" @click="sub">提交</el-button></el-row>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import request from '@/utils/request';
// const env = 'http://localhost:5050'
const env = ''
const APIS = {
    add: `${env}/admin/addProduct`,
    search: `${env}/admin/productList`,
    detail: `${env}/admin/productDetail`,
    edit: `${env}/admin/updateProduct`,
    hide: `${env}/admin/hideProduct`,
    getCategory: `${env}/admin/categoryList`,
}
export default {
    data() {
        return {
            tableData: [],
            showDialogField: false,
            Category: [],
            dialog: {
                No: '',
                category: '',
                price: '',
                url: '',
                backup: [{
                    title: '',
                    price: ''
                }]
            },
            pageSize: 20,
            pageIndex: 1,
            env: env
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
        request('get', APIS.getCategory, {}).then(res => {
            this.Category = res.data;
        })
    },
    methods: {
        search() {
            setTimeout(() => {
                request('get', APIS.search, {}).then(res => {
                    this.tableData = res.data;
                })
            }, 500)
        },
        open(No) {
            this.showDialogField = true;
            if (No) {
                this.type = 'edit'
                request('post', `${APIS.detail}`, {No: No}).then(res => {
                    let data = res.data[0];
                    if (data) {
                        let temp = []
                        if (data.backup) {
                            let backup = data.backup.split(';');
                            backup.forEach(item => {
                                if(item) {
                                    temp.push({
                                        title: item.split(',')[0],
                                        price: item.split(',')[1]
                                    })
                                }
                            })
                        }
                        this.dialog = {
                            No: data.No,
                            category: data.category,
                            price: data.price,
                            url: data.url,
                            backup: temp
                        }
                    }
                }).catch(() => {
                    this.$message.error('获取详情失败');
                })
            } else {
                this.type = 'add';
            }
        },
        add() {
            this.dialog.backup.push({
                title: '',
                price: ''
            })
        },
        minus(index) {
            this.dialog.backup.splice(index, 1);
        },
        hide(No, isshow) {
            this.$confirm('确定该操作么', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request('post', APIS.hide, {No: No, isshow: isshow}).then(res => {
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
                No: this.dialog.No,
                category: this.dialog.category,
                price: this.dialog.price,
                url: this.dialog.url,
            }
            // || 'https://p0.meituan.net/deal/db14c4016f7cd8459d0fce13b433495b80082.jpg'
            if (this.dialog.backup.length > 0 && this.dialog.backup[0].title) {
                let res = '';
                this.dialog.backup.forEach(item => {
                    res += `${item.title},${item.price};`
                })
                param.backup = res;
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
                No: '',
                category: '',
                price: '',
                url: '',
                backup: [{
                    title: '',
                    price: ''
                }]
            }
        },
        handleAvatarSuccess(res, file) {
            this.dialog.url = res.filename;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 0.1;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 100KB!');
            }
            return isJPG && isLt2M;
        }
    }
}
</script>
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>