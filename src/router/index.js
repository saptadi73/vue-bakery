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
          component: () => import('../pages/TableOrderListForHQ.vue'),
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
          path: 'edit/:id',
          name: 'edit order form',
          component: () => import('../components/EditOrderForm.vue'),
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
          path: 'orders',
          name: 'delivery orders',
          component: () => import('../pages/TableDeliveryOrders.vue'),
        },
        {
          path: 'orders/outlet',
          name: 'delivery orders by outlet',
          component: () => import('../pages/TableDeliveryOrdersByOutlet.vue'),
        },
        {
          path: 'orders/:id',
          name: 'detail delivery order',
          component: () => import('../pages/DetailDeliveryOrder.vue'),
        },
        {
          path: 'receives',
          name: 'receives',
          component: () => import('../pages/TableReceives.vue'),
        },
        {
          path: 'receives/:id',
          name: 'detail receive',
          component: () => import('../pages/DetailReceive.vue'),
        },
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
        {
          path: 'create/:id',
          name: 'create delivery order',
          component: () => import('../components/DeliveryOrderForm.vue'),
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
        {
          path: 'reports/orders',
          name: 'order report',
          component: () => import('../pages/DashboardOrderReport.vue'),
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
        {
          path: 'summary',
          name: 'Product Summary',
          component: () => import('../pages/TableProductSummary.vue'),
        },
        {
          path: 'summary/roti',
          name: 'product summary roti',
          component: () => import('../pages/TableProductSummaryRoti.vue'),
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
        {
          path: 'adjustment',
          name: 'adjustment',
          component: () => import('../pages/InventoryAdjustemnt.vue'),
        },
      ],
    },
  ],
})

// Navigation guard for role-based access control
router.beforeEach((to, from, next) => {
  const roleId = localStorage.getItem('role_id')
  console.log('Current role_id:', roleId, 'Navigating to:', to.path)

  const allowedPathsForEmployee = [
    '/produk/list',
    '/outlet/list',
    '/order/list',
    'order/edit/:id',
    '/order/create',
    '/delivery/orders/outlet',
    '/delivery/orders',
    '/main/dashboard',
    '/login',
    '/', // home/login page
  ]

  // If role_id is 2 or 3 (employee), restrict access
  if (roleId === '2' || roleId === '3') {
    console.log('Employee role detected, checking access...')
    const isAllowed = allowedPathsForEmployee.some((allowedPath) => {
      // Check exact match or if the path starts with allowed path
      const allowed = to.path === allowedPath || to.path.startsWith(allowedPath + '/')
      console.log(`Checking ${to.path} against ${allowedPath}: ${allowed}`)
      return allowed
    })

    console.log('Is allowed:', isAllowed)

    if (!isAllowed) {
      console.log('Access denied, redirecting to login')
      // Redirect to login if trying to access restricted page
      next('/login')
      return
    }
  }

  // Allow access for other roles or allowed paths
  console.log('Access allowed')
  next()
})

export default router
