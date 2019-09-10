<template>
    <div>
        <el-menu :default-active="path" background-color="#eeeeee" router>
            <el-menu-item index="/">
                <i class="el-icon-menu"></i>
                <span slot="title">添加商品</span>
            </el-menu-item>
            <el-menu-item index="/category">
                <i class="el-icon-document"></i>
                <span slot="title">添加分类</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    computed: {
        path() {
            return this.$route.path
        }
    },
    data() {
        return {

        }
    }
}
</script>