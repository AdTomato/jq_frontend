
export const formDesignRouter = {
  path: 'form-design/:sheetCode',
  name: 'form-design',
  meta: { title: '晶奇-表单设计' },
  props: true,
  component: () => import('./form-design.vue')
}