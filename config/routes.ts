const routes = [
  { path: '/login', component: 'Login', layout: false, meta: { auth: false } },
  {
    path: '/register',
    component: 'Register',
    layout: false,
    meta: { auth: false },
  },
  {
    path: '/',
    component: '@/wrappers/RouteGuard',
    routes: [
      {
        path: '/',
        component: 'Dashboard',
        meta: {
          title: '仪表板',
          permissions: [],
        },
      },
      {
        path: '/profile',
        component: 'Profile',
        meta: {
          title: '个人资料',
          permissions: [],
        },
      },
      {
        path: '/docs',
        component: 'Docs',
        meta: {
          title: '文档',
          permissions: [],
        },
      },
      {
        path: '/403',
        component: 'Error/403',
      },
    ],
  },
  {
    path: '/system',
    component: '@/wrappers/RouteGuard',
    routes: [
      {
        path: '/system/user',
        component: 'System/User',
        meta: {
          title: '用户管理',
          permissions: ['system:user:list'],
        },
      },
      {
        path: '/system/role',
        component: 'System/Role',
        meta: {
          title: '角色管理',
          permissions: ['system:role:list'],
        },
      },
      {
        path: '/system/permission',
        component: 'System/Permission',
        meta: {
          title: '权限管理',
          permissions: ['system:permission:list'],
        },
      },
      {
        path: '/system/menu',
        component: 'System/Menu',
        meta: {
          title: '菜单管理',
          permissions: ['system:menu:list'],
        },
      },
      {
        path: '/system/department',
        component: 'System/Department',
        meta: {
          title: '部门管理',
          permissions: ['system:department:list'],
        },
      },
      {
        path: '/system/position',
        component: 'System/Position',
        meta: {
          title: '职位管理',
          permissions: ['system:position:list'],
        },
      },
      {
        path: '/system/dictionary',
        component: 'System/Dictionary',
        meta: {
          title: '字典管理',
          permissions: ['system:dictionary:list'],
        },
      },
      {
        path: '/system/dictionary/items/:typeId',
        component: 'System/Dictionary/Items',
        meta: {
          title: '字典项管理',
          permissions: ['system:dictionary:list'],
        },
      },
      {
        path: '/system/config',
        component: 'System/Config',
        meta: {
          title: '系统配置',
          permissions: ['system:config:list'],
        },
      },
      {
        path: '/system/notice',
        component: 'System/Notice',
        meta: {
          title: '通知公告',
          permissions: ['system:notice:list'],
        },
      },
      {
        path: '/system/log',
        meta: {
          title: '日志管理',
        },
        routes: [
          {
            path: '/system/log/login',
            component: 'System/Log/Login',
            meta: {
              title: '登录日志',
              permissions: ['system:log-login:list'],
            },
          },
          {
            path: '/system/log/operation',
            component: 'System/Log/Operation',
            meta: {
              title: '操作日志',
              permissions: ['system:log-operation:list'],
            },
          },
        ],
      },
      // 用户分配角色
      {
        path: '/system/user-auth/role/:userId',
        component: 'System/User/AuthRole',
        meta: {
          title: '用户分配角色',
          permissions: ['system:user:update-roles'],
        },
      },
      // 角色分配权限
      {
        path: '/system/role-auth/permission/:roleId',
        component: 'System/Role/AuthPermission',
        meta: {
          title: '角色分配权限',
          permissions: ['system:role:update-permissions'],
        },
      },
      // 角色分配用户
      {
        path: '/system/role-auth/user/:roleId',
        component: 'System/Role/AuthUser',
        meta: {
          title: '角色分配用户',
          permissions: ['system:role:update-users'],
        },
      },
    ],
  },
  {
    path: '/monitor',
    component: '@/wrappers/RouteGuard',
    routes: [
      {
        path: '/monitor/server',
        component: 'Monitor/Server',
        meta: {
          title: '服务监控',
          permissions: ['monitor:server:list'],
        },
      },
      {
        path: '/monitor/online-user',
        component: 'Monitor/OnlineUser',
        meta: {
          title: '在线用户',
          permissions: ['monitor:online-user:list'],
        },
      },
      {
        path: '/monitor/cache',
        component: 'Monitor/CacheMonitor',
        meta: {
          title: '缓存监控',
          permissions: ['monitor:cache:list'],
        },
      },
    ],
  },
  // AFRIBID Marketplace（独立前台，不走后台 Layout / RouteGuard）
  {
    path: '/afribid',
    component: '@/layouts/AfribidLayout',
    layout: false,
    meta: { auth: false },
    routes: [
      { path: '/afribid', redirect: '/afribid/home' },
      {
        path: '/afribid/home',
        component: 'Afribid/Home',
        meta: { title: 'Home', auth: false },
      },
      {
        path: '/afribid/vehicles',
        component: 'Afribid/Vehicles',
        meta: { title: 'Vehicles', auth: false },
      },
      {
        path: '/afribid/vehicle/:id',
        component: 'Afribid/VehicleDetail',
        meta: { title: 'Vehicle', auth: false },
      },
      {
        path: '/afribid/auctions',
        component: 'Afribid/Auctions',
        meta: { title: 'Live auctions', auth: false },
      },
      {
        path: '/afribid/live/:id',
        component: 'Afribid/Live',
        meta: { title: 'Live room', auth: false },
      },
      {
        path: '/afribid/calendar',
        component: 'Afribid/Calendar',
        meta: { title: 'Auction calendar', auth: false },
      },
      {
        path: '/afribid/login',
        component: 'Afribid/Login',
        meta: { title: 'Sign in', auth: false },
      },
      {
        path: '/afribid/register',
        component: 'Afribid/Register',
        meta: { title: 'Register', auth: false },
      },
      {
        path: '/afribid/account',
        component: 'Afribid/Account',
        meta: { title: 'My account', auth: false },
      },
      {
        path: '/afribid/account/profile',
        component: 'Afribid/Account/Profile',
        meta: { title: 'Profile', auth: false },
      },
      {
        path: '/afribid/account/verification',
        component: 'Afribid/Account/Verification',
        meta: { title: 'Verification', auth: false },
      },
      {
        path: '/afribid/account/wallet',
        component: 'Afribid/Account/Wallet',
        meta: { title: 'Wallet', auth: false },
      },
      {
        path: '/afribid/account/auctions',
        component: 'Afribid/Account/Auctions',
        meta: { title: 'My auctions', auth: false },
      },
      {
        path: '/afribid/account/watchlist',
        component: 'Afribid/Account/Watchlist',
        meta: { title: 'Watchlist', auth: false },
      },
      {
        path: '/afribid/account/inquiries',
        component: 'Afribid/Account/Inquiries',
        meta: { title: 'Inquiries', auth: false },
      },
      {
        path: '/afribid/account/orders',
        component: 'Afribid/Account/Orders',
        meta: { title: 'Orders', auth: false },
      },
      {
        path: '/afribid/account/notifications',
        component: 'Afribid/Account/Notifications',
        meta: { title: 'Notifications', auth: false },
      },
      {
        path: '/afribid/inquiry/:id',
        component: 'Afribid/Inquiry',
        meta: { title: 'Inquiry', auth: false },
      },
      {
        path: '/afribid/order/:id',
        component: 'Afribid/Order',
        meta: { title: 'Order', auth: false },
      },
      {
        path: '/afribid/how-it-works',
        component: 'Afribid/Info/HowItWorks',
        meta: { title: 'How it works', auth: false },
      },
      {
        path: '/afribid/deposits',
        component: 'Afribid/Info/Deposits',
        meta: { title: 'Deposits', auth: false },
      },
      {
        path: '/afribid/help',
        component: 'Afribid/Info/Help',
        meta: { title: 'Help', auth: false },
      },
      {
        path: '/afribid/contact',
        component: 'Afribid/Info/Contact',
        meta: { title: 'Contact', auth: false },
      },
      {
        path: '/afribid/terms',
        component: 'Afribid/Info/Terms',
        meta: { title: 'Terms', auth: false },
      },
      {
        path: '/afribid/privacy',
        component: 'Afribid/Info/Privacy',
        meta: { title: 'Privacy', auth: false },
      },
      {
        path: '/afribid/restricted',
        component: 'Afribid/Info/Restricted',
        meta: { title: 'Restricted', auth: false },
      },
    ],
  },
  {
    path: '*',
    layout: false,
    routes: [
      {
        path: '*',
        component: 'Error/404',
      },
    ],
  },
];

export default routes;
