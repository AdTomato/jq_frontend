
export const formPreviewRouter = {
  path: 'form-preview/:sheetCode',
  name: 'form-preview',
  meta: { title: '晶奇-表单设计-预览' },
  props: true,
  component: () => import('./form-preview.vue')
}