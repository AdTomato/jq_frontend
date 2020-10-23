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
    /* 我创建的工单 */
    myCreatedWorkOrder: {
      path: 'myCreatedWorkOrder',
      name: 'myCreatedWorkOrder',
      component: () => import('./pages/WorkOrderCreatedByMe'),
    },
    /* 我收到的工单 */
    myReceivedWorkOrder: {
      path: 'myReceivedWorkOrder',
      name: 'myReceivedWorkOrder',
      component: () => import('./pages/WorkOrderReceivedByMe'),
    },
  }
} as any;
