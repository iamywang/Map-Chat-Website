import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/Login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'System',
    hidden: false,
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/Index/index'),
      meta: { title: '主页', icon: 'home' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/func1',
    name: 'userManagement',
    meta: { title: '用户管理', icon: 'users' },
    children: [
      {
        path: 'func1',
        name: 'userManage',
        component: () => import('@/views/UserList/index'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'func2',
        name: 'addUser',
        component: () => import('@/views/AddUser/index'),
        meta: { title: '添加用户', icon: 'add' }
      },
      {
        path: 'func3',
        name: 'friendsManagement',
        component: () => import('@/views/FriendList/index'),
        meta: { title: '好友管理', icon: 'manage' }
      },
      {
        path: 'func4',
        name: 'feedManagement',
        component: () => import('@/views/FeedBackList/index'),
        meta: { title: '反馈管理', icon: 'feedback' }
      }
    ]
  },

  {
    path: '/gps',
    component: Layout,
    redirect: '/gps/func1',
    name: 'gpsManagement',
    meta: { title: '位置管理', icon: 'locationm' },
    children: [
      {
        path: 'func1',
        name: 'gpsManage',
        component: () => import('@/views/Map/index'),
        meta: { title: '地图', icon: 'map' }
      },
      {
        path: 'func2',
        name: 'history',
        component: () => import('@/views/GPSHistory/index'),
        meta: { title: '历史轨迹', icon: 'path' }
      },
      {
        path: 'func3',
        name: 'gpsManage',
        component: () => import('@/views/GPSList/index'),
        meta: { title: '位置管理', icon: 'location' }
      }
    ]
  },

  {
    path: '/msg',
    component: Layout,
    redirect: '/msg/func1',
    name: 'msgManagement',
    meta: { title: '消息管理', icon: 'message' },
    children: [
      {
        path: 'func1',
        name: 'msgManage',
        component: () => import('@/views/MessageList/index'),
        meta: { title: '消息管理', icon: 'manage' }
      },
      {
        path: 'func2',
        name: 'msgTotal',
        component: () => import('@/views/MessageData/index'),
        meta: { title: '消息统计', icon: 'statistics' }
      },
      {
        path: 'func3',
        name: 'addMessage',
        component: () => import('@/views/AddMessage/index'),
        meta: { title: '添加消息', icon: 'addm' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
