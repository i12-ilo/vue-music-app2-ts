import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../components/recommend/recommend.vue'),
    children:[
      {
        path:':id',
        component:()=>import("../components/disc/disc.vue")
      }
    ]
  },
  {
    path:"/singer",
    name:"singer",
    component:()=>import("../components/singer/singer.vue"),
    children:[
      {
        path:':id',
        component:()=>import("../components/singer-detail/singer-detail.vue")
     }]
  },
  {
    path:'/rank',
    name:'rank',
    component:()=>import('../components/rank/rank.vue'),
    children:[
      {
        path:":id",
        component:()=>import("../components/top-list/top-list.vue")
      }
    ]
  },
  {
    path:'/search',
    name:'search',
    component:()=>import("../components/search/search.vue")
  },
  {
    path:'/user',
    name: 'user',
    component:()=>import("../components/user-center/user-center.vue")
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
