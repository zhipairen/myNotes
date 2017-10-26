import * as types from '../types'
import api from '../api'
import router from '../../router'

const state = {
  username: ''
}

const getters = {
  username: state => state.username
}

const actions = {
  // 注册
  async register ({
    commit
  }, {
    context,
    username,
    email,
    password
  }) {
    let res = await api.register({
      name: username,
      email,
      password
    })
    await commit(types.LOGIN_SIGNUP, { res, context })
  },
  // 登录
  async login ({
    commit
  }, {
    context,
    username,
    password
  }) {
    let res = await api.login({
      name: username,
      password
    })
    await commit(types.LOGIN_SIGNIN, { res, context })
  },
  // 注销
  async logout () {
    localStorage.removeItem('token')
    router.push('login')
  },
  // 获取当前用户信息
  async backUserInfo ({
    commit
  }) {
    let res = await api.backUserInfo()
    await commit(types.BACK_USER_INFO, res)
  }
}

const mutations = {
  // 注册
  [types.LOGIN_SIGNUP] (state, { res, context }) {
    if (res.data.code === 1) {
      localStorage.setItem('token', res.data.token)
      router.push('cms')
    } else {
      context.$message.error(res.data.msg)
    }
  },
  // 获取当前用户信息
  [types.BACK_USER_INFO] (state, res) {
    if (res.data.code === 1) {
      state.username = res.data.name
    } else {
      // token超时
      localStorage.removeItem('token')
      router.push('login')
    }
  },
  // 登录
  [types.LOGIN_SIGNIN] (state, { res, context }) {
    if (res.data.code === 1) {
      localStorage.setItem('token', res.data.token)
      router.push('cms')
    } else {
      context.$message.error(res.data.msg)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
