export default {
  formDetail: {
    path: '/form/detail',
    name: 'form-detail',
    component: () => import('@/views/form/form-detail.vue')
  },
  formCalendar: {
    path: '/form/detail/calendar',  //  /application
    name: 'form-calendar',
    component: () => import('./calendar.vue')
  },
  application: {
    /* 树形工单 */
    workOrderTree: {
      path: 'workOrderTree',
      name: 'workOrderTree',
      component: () => import('./WorkOrderTree.vue'),
    },
  }
} as any;
