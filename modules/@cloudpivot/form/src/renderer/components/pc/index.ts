

export default {
    FormRenderer: () => import(/* webpackChunkName: "pc-form-renderer" */'../pc-form-renderer.vue'),
    StaffSelector : () => import('../shared/staff-selector.vue'),
    H3Textarea : () => import('./h3-textarea.vue')
};