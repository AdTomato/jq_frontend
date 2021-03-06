export default {
    PageLoading: () => import('./page-loading/page-loading.vue'),
    PageNoData: () => import('./page-no-data/page-no-data.vue'),
    LoadFail: () => import('./load-fail/load-fail.vue'),
    UserPopover: () => import('./user/user-popover.vue'),
    H3SizeSlider: () => import('./size-slider.vue'),
    H3SizeRectangle: () => import('./size-rectangle.vue'),
    EmptyHeader: () => import('./empty-header/empty-header.vue'),
    FormUnpublished: () => import('./form-unpublished/form-unpublished.vue'),
    Panel: () => import('./panel.vue'),
    RoleSelect: () => import('./role-selector/index.vue'),
}