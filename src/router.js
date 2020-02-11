import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/auth/login.vue'
import ResetPass from './components/auth/resetPass.vue'
import Register from './components/auth/register.vue'

import Dashboard from './views/dashboard.vue'
import serviceRequest from './views/serviceRequest/index.vue'
import Favourite from './views/favourite/index.vue'

import Profile from './views/profile/index.vue'

import store from './store/index'

import AdminDashboard from './views/admin/index.vue'
import Requests from './views/admin/requests.vue'
import Report from './views/admin/report/requests.vue'
import Healthworkers from './views/admin/Healthworkers.vue'


import Ratings from './views/admin/WorkerRatings.vue'

import Permissions from './views/admin/Permissions.vue'
import Roles from './views/admin/Roles.vue'
import RolesUser from './views/admin/roleUsers.vue'

import Facilities from './views/admin/facilities.vue'
import Users from './views/admin/users.vue'

import AllUsers from './views/admin/allusers.vue'

import passReset from './components/auth/passReset.vue'

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
  //mode: 'history',
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
      path: '/service-requests',
      name: 'serviceRequest',
      component: serviceRequest,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/favourites',
      name: 'favourite',
      component: Favourite,
      beforeEnter: ifAuthenticated,
    },



//Admin Routes

    {
      path: '/admin/',
      name: 'AdminDashboard',
      component: AdminDashboard,
       beforeEnter: ifAuthenticated,
    },

        {
      path: '/admin/requests',
      name: 'Requests',
      component: Requests,
       beforeEnter: ifAuthenticated,
    },

    {
      path: '/admin/Healthworkers',
      name: 'Healthworkers',
      component: Healthworkers,
       beforeEnter: ifAuthenticated,
    },

    {
      path: '/admin/users',
      name: 'Users',
      component: Users,
       beforeEnter: ifAuthenticated,
    },

    {
      path: '/admin/WorkerRatings',
      name: 'Ratings',
      component: Ratings,
       beforeEnter: ifAuthenticated,
    },

    {
      path: '/admin/Permissions',
      name: 'Permissions',
      component: Permissions,
       beforeEnter: ifAuthenticated,
    },

      {
      path: '/admin/Roles',
      name: 'Roles',
      component: Roles,
       beforeEnter: ifAuthenticated,
    },

          {
      path: '/admin/roleUsers',
      name: 'RolesUser',
      component: RolesUser,
       beforeEnter: ifAuthenticated,
    },

    {
      path: '/admin/report/requests',
      name: 'Report',
      component: Report,
       beforeEnter: ifAuthenticated,
    },


    {
      path: '/admin/facilities',
      name: 'Facilities',
      component: Facilities,
       beforeEnter: ifAuthenticated,
    },


    {
      path: '/admin/allusers',
      name: 'AllUsers',
      component: AllUsers,
       beforeEnter: ifAuthenticated,
    },
    {
      path: '/password-reset/:token/:email',
      name: 'passReset',
      component: passReset
    }



  ]
})
