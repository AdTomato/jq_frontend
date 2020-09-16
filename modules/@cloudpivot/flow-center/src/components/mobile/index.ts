export default {
    InitialInstance: () => import('./initial-instance.vue'),
    MyInstanceItem: () => import('./my-instance/item.vue'),
    MyUnFinishedWorkItem: () => import('./my-unfinished-workItem.vue'),
    MyUnReadWorkItem: () => import('./my-unread-workitem.vue'),
    MyFinishedWorkItem: () => import('./my-finished-workitem.vue'),
    MyReadWorkItem: () => import('./my-read-workitem.vue'),
    AppTask: () => import('./app-task.vue')
  }