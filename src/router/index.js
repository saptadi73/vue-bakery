import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../user/loginUser.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../user/loginUser.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../layouts/LayoutDefaultBakery.vue'),
      children: [
        {
          path: 'all',
          name: 'all order',
          component: () => import('../pages/TableOrderProduct.vue'),
        },
        {
          path: 'list',
          name: 'list order',
          component: () => import('../pages/TableOrderList.vue'),
        },
        {
          path: 'create',
          name: 'create order form',
          component: () => import('../components/CreateOrderForm.vue'),
        },
        {
          path: 'summary',
          name: 'summary order',
          component: () => import('../pages/TableOrderSummaryPerProduct.vue'),
        },
        {
          path: 'summary/outlet/:id/:nama',
          name: 'summary order outlet',
          component: () => import('../pages/TableOutletOrderSummary.vue'),
        },
      ],
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: () => import('../layouts/LayoutDefaultBakery.vue'),
      children: [
        {
          path: 'group',
          name: 'delivery group',
          component: () => import('../pages/TableOutletDistribusiProduk.vue'),
        },
        {
          path: 'outlet/:id/:kode/:nama',
          name: 'delivery produk',
          component: () => import('../pages/CardReportDeliveryProduk.vue'),
        },
      ],
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../layouts/LayoutDefaultBakery.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../pages/DashboardBakery.vue'),
        },
      ],
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../layouts/LayoutDefaultBakery.vue'),
      children: [
        {
          path: 'register',
          name: 'registrasi',
          component: () => import('../components/UserRegisterForm.vue'),
        },
      ],
    },
    {
      path: '/produk',
      name: 'produk',
      component: () => import('../layouts/LayoutDefaultBakery.vue'),
      children: [
        {
          path: 'list',
          name: 'daftar produk',
          component: () => import('../pages/TableProductBakery.vue'),
        },
      ],
    },
    {
      path: '/outlet',
      name: 'outlet',
      component: () => import('../layouts/LayoutDefaultBakery.vue'),
      children: [
        {
          path: 'list',
          name: 'daftar outlet',
          component: () => import('../pages/TableOutletBakery.vue'),
        },
      ],
    },
    {
      path: '/kitchen',
      name: 'kitchen',
      component: () => import('../layouts/LayoutDefaultBakery.vue'),
      children: [
        {
          path: 'stock',
          name: 'daftar kitchen',
          component: () => import('../pages/TableStockKitchen.vue'),
        },
        {
          path: 'distribution/:id/:nama/:kode',
          name: 'history kitchen',
          component: () => import('../pages/TabletStockDistributed.vue'),
        },
      ],
    },
  ],
})

export default router
