/* 接口响应数据内容 */
export interface Data<T = any> {
  data: T,
  errcode?: number,
  errmsg?: string,
}

export interface Dict {
  /**
   * 字典编码
   */
  code: string | number;
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
  /**
   * 链接地址
   */
  link?: string;
}

export type DictData = Record<string | number, Dict>

export type DictItem = 'user' | 'department' | 'urgency_degree' | 'work_order_status';

export type DictItemMap = Record<DictItem, DictData>
