<template>
  <div id="app">
    <el-container>
        <el-header style="background-color: #fefefe"></el-header>
        <el-container>
            <el-aside width="200px">
                <side-menu />
            </el-aside>
            <router-view />
        </el-container>
    </el-container>
  </div>
</template>

<script>
import sideMenu from '@/components/menu';
export default {
  name: 'App',
  components: {
    sideMenu
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'PingFangSC', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
