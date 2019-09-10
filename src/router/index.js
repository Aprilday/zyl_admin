import Vue from 'vue';
import Router from 'vue-router';
import Add from '@/components/Add';
import Category from '@/components/Category';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '添加商品',
      component: Add
    },
    {
      path: '/category',
      name: '添加类别',
      component: Category
    }
  ]
})
