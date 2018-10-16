import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Main,
      name: 'InsectofKorea',
      meta: {
        title: 'Insects of Korea',
        icon: 'contestcup'
      },
      children: [
        {path: '/:searchText', component: () => import('@/views/Main'), name: 'Search', meta: { title: 'Insects of Korea' }}
      ]
    }
  ]
})
