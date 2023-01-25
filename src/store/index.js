import { createStore } from 'vuex'
import auth from '@/store/modules/auth'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth
  },
  strict: process.env.NODE_ENV !== 'production',
})
