import {WorkOrder, WorkOrderQuery} from "../types/WorkOrder";
import request from './service';

const WorkOrderUrl = (uid: string, type: string) => `/api/work_order/${uid}/${type}`;

export default {

  getWorkOrder(type: 'create' | 'receive', queryParams?: WorkOrderQuery): Promise<WorkOrder[]> {
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
