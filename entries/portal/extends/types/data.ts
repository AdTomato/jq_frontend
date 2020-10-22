/* 接口响应数据内容 */
export interface Data<T = any> {
  data: T,
  errcode?: number,
  errmsg?: string,
}

export interface DictContent {
  /**
   * 显示值
   */
  name: string;
  /**
   * 是否使用标签
   */
  tag?: boolean;
  /**
   * 标签的颜色
   */
  color?: string | false;
}

export type DictData = Record<string | number, DictContent>

export type DictItem = Record<string, DictData>
