import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    isLoggedIn: false,
    insectImages: {}
  }
})

export default store
