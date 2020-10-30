import {WorkOrder, WorkOrderQuery, WorkOrderType} from "../types/WorkOrder";
import request from './service';
import {Dict, DictData, DictItem} from "../types/data";
import env from '../../src/config/env'

const {apiHost} = env;

const WorkOrderUrl = (uid: string, type: string) => `${apiHost}/api/work_order/${uid}/${type}`;
const DictUrl = (dictItem: string) => `${apiHost}/api/dict/${dictItem}`;

export default {

  /**
   * 获取工单数据
   * @param type
   * @param queryParams
   */
  getWorkOrder(type: WorkOrderType, queryParams?: WorkOrderQuery): Promise<WorkOrder[]> {
    const uid: string = (JSON.parse(sessionStorage.getItem("user") as string) as any).id
    if (!uid) {
      return;
    }
    const url = WorkOrderUrl(uid, type);
    const r = request({
      url,
      method: 'get',
      params: {
        ...queryParams
      }
    })
    return r as Promise<WorkOrder[]>;
  },

  /**
   * 获取数据字典
   * @param dictItem
   */
  async getDict(dictItem: DictItem) {
    const url = DictUrl(dictItem);
    const result: Dict[] = await request({
      url,
      method: 'get',
    }) as Dict[];
    return result.reduce((prev, cur) => {
      return {...prev, [cur.code]: cur}
    }, {} as DictData)
  },

  /**
   * 我创建的工单
   * @param queryParams
   */
  getWorkOrderByCreator(queryParams?: WorkOrderQuery): Promise<WorkOrder[]> {
    return this.getWorkOrder('create', queryParams)
  },

  /**
   * 我收到的工单
   * @param queryParams
   */
  getWorkOrderByRecipient(queryParams?: WorkOrderQuery): Promise<WorkOrder[]> {
    return this.getWorkOrder('receive', queryParams)
  }
};
