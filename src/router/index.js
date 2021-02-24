import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import home from '@/components/home'
import articleClass from '@/components/articleClass'
import article from '@/components/article'
import deskClass from '@/components/deskClass'
import desk from '@/components/desk'
import bigclass from '@/components/bigclass'
import smallclass from '@/components/smallclass'
import foods from '@/components/foods'
import orders from '@/components/orders'
import admin from '@/components/admin'
import adminLogin from '@/components/adminLogin'
import commentsList from '@/components/commentsList'
import userList from '@/components/userList'
import sendWords from '@/components/sendWords'


import test from '@/components/test'
import test1 from '@/components/test1'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index,
      children:
        [
          {
            path: '/home',
            component:home
          },
          {
          path: '/articleClass',
          component:articleClass
        },
        {
          path: '/article',
          component:article
        },
        {
          path: '/deskClass',
          component:deskClass
        },
        {
          path: '/desk',
          component:desk
        },
        {
          path: '/foods',
          component:foods
        },
        {
          path: '/smallclass',
          component:smallclass
        },
        {
          path: '/bigclass',
          component:bigclass
        },
        {
          path: '/orders',
          component: orders
        },
        {
          path: '/admin',
          component:admin
        },
        {
          path: '/commentsList',
          component:commentsList
        },
        {
          path: '/userList',
          component:userList
        },
        {
          path: '/sendWords',
          component:sendWords
        }
      ]
    },
    {
      path: '/adminLogin',
      component:adminLogin
    },
    {
      path: '/test',
      component:test
    },
    {
      path: '/test1',
      component: test1
    }
    
  ]
})
