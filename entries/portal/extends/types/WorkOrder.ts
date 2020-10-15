import {AxiosPromise} from "axios";

/* 接口响应数据内容 */
interface Data<T> {
  data: T,
  errcode?: number,
  errmsg?: string,
}

export interface AxiosResult<T> extends AxiosPromise<Data<T>> {
}

/**
 * 工单实体描述,与 java 属性对应
 */
export interface WorkOrder {
  id: string


  children?: WorkOrder[];
}
