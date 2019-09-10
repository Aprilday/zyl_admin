import axios from 'axios';
import { Message, Loading } from 'element-ui';

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
let loading;
// POST传参序列化
axios.interceptors.request.use((config) => {
  // 单个网站的admin用户
  // config.headers.common['Gw-Admin-Access-Token'] = store.getters.adminAccessToken
  // 整个网点user
  // config.headers.common['Gw-User-Access-Token'] = store.getters.userAccessToken
  loading = Loading.service();
  return config
}, (err) => {
  Message.error('参数错误')
  return Promise.reject(err)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
    const response = res.data
    if(response.code === 302) {
        location.href = '/admin/login';
        return
    }
    loading.close()
    return response
}, (err) => {
    loading.close()
    Message.error('Oops, 出错啦')
    return Promise.reject(err)
})

export default function request(method, url, data) {
    // 处理请求的url和数据
    data = method === 'get' ? { params: data } : data
    // 发送请求
    return new Promise((resolve, reject) => {
        axios[method](url, data)
            .then(response => {
                resolve(response)
            }, error => {
                reject(error)
            })
            .catch(error => {
                reject(error)
            })
    }).catch(error => {
        console.log(error)
    })
}
