import Vue from 'vue'
import Vuex from 'vuex'
import back from './modules/back'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    back
  }
})

export default store
