import Vue from 'vue';
import { Dialog, Menu, Submenu, Input, Button, Option, Select, Table, TableColumn, Form, FormItem, Row, Col, Upload, Container, Header, Main, Loading, MessageBox, Message, Aside, MenuItem, RadioGroup, Radio } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';

Vue.config.productionTip = false

Vue.use(Dialog)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Option)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Input)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(MenuItem)

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
