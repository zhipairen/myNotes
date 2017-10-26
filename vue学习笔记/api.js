import axios from 'axios'
const instance = axios.create()

axios.default.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'

instance.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use = instance.interceptors.request.use
instance.interceptors.request.use(config => {
  if (localStorage.getItem('token')) {
    config.headers.Authorization = `token ${localStorage.getItem('token')}`.replace(/(^")|("$)/g, '')
  }
  return config
}, err => {
  return Promise.reject(err)
})
// axios拦截响应
instance.interceptors.response.use(response => {
  return response
}, err => {
  return Promise.reject(err)
})

let domain = '/api'
export default {
  register: params => instance.post(`${domain}/user/register`, params),
  login: params => instance.post(`${domain}/user/login`, params),
  backUserInfo: params => instance.get(`${domain}/user/userInfo`, params)
}
