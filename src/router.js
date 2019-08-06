import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Projects from './views/Projects.vue'
import Team from './views/Team.vue'
import Login from './components/login.vue'
import ResetPass from './components/resetPass.vue'
import Register from './components/register.vue'
import store from './store/index'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
    next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/reset-password',
      name: 'ResetPass',
      component: ResetPass,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/team',
      name: 'team',
      component: Team,
      beforeEnter: ifAuthenticated,
    }
  ]
})
