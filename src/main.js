// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueHead from 'vue-head'

import firebase from 'firebase'

Vue.config.productionTip = false
Vue.use(Element)
Vue.use(VueHead)

/* firebase initialize */
var config = {
  apiKey: 'AIzaSyD22AdiFz4572hUA1mMnFTVO5RcsC2Z_Zw',
  authDomain: 'favonius-1505c.firebaseapp.com',
  databaseURL: 'https://favonius-1505c.firebaseio.com',
  projectId: 'favonius-1505c',
  storageBucket: 'favonius-1505c.appspot.com',
  messagingSenderId: '940882386001'
}
firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    store.state.user = user
    store.state.isLoggedIn = true
  } else {
    store.state.user = {}
    store.state.isLoggedIn = false
  }
})

const settings = {timestampsInSnapshots: true}
firebase.firestore().settings(settings)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
