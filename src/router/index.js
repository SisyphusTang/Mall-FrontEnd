import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/home/Home.vue')
const Layout = () => import('../layout/Layout.vue')
const ProductList = () => import('../views/ProductList/ProductList.vue')
const About = () => import('../views/About.vue')
const Notice = () => import('../views/Notice.vue')
const Like = () => import('../views/Like.vue')
const Cart = () => import('../views/Cart.vue')
const Order = () => import('../views/Order.vue')
const Profile = () => import('../views/Profile.vue')
const Details = () => import('../views/details/Details.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: '/home',
        component: Home,
        meta: {
          name: '首页'
        }
      },
      {
        path: '/product_list',
        component: ProductList,
        meta: {
          name: '商品列表'
        }
      },
      {
        path: '/about',
        component: About,
        meta: {
          name: '关于我们'
        }
      },
      {
        path: '/notice',
        component: Notice,
        meta: {
          name: '网站公告'
        }
      },
      {
        path: '/like',
        component: Like,
        meta: {
          name: '我的收藏夹'
        }
      },
      {
        path: '/cart',
        component: Cart,
        meta: {
          name: '购物车'
        }
      },
      {
        path: '/order',
        component: Order,
        meta: {
          name: '所有订单'
        }
      },
      {
        path: '/profile',
        component: Profile,
        meta: {
          name: '个人信息'
        }
      },
      {
        path: '/details',
        component: Details,
        meta: {
          name: '商品详情'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.name
  next()
})

export default router
