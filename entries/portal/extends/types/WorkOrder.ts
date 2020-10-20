import {AxiosPromise} from "axios";

/* 接口响应数据内容 */
export interface Data<T = any> {
  data: T,
  errcode?: number,
  errmsg?: string,
}

export interface AxiosResult<T = any> extends AxiosPromise<Data<T>> {
}

/**
 * 工单实体描述,与 java 属性对应
 */
export interface WorkOrder {
  id: string
  parentId?: string

  children?: WorkOrder[];

  [key: string]: any
}

/* 工单查询条件 */
export interface WorkOrderQuery {
  title: string,
  urgency_degree: 'NORMAL' | 'URGENCY',
  overdue: 'true' | 'false' | string,
  status: 'PROCESSING' | string
}
