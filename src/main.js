import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router/router'
import store from './store'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'
fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('common/image/loading.gif')
})

/* eslint-disable no-new */
// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
