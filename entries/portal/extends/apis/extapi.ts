import Axios, {AxiosRequestConfig} from "axios";
import {AxiosResult, WorkOrder} from "../types/WorkOrder";

const request = Axios.create({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
} as AxiosRequestConfig)


const workOrderTreeUrl = `/api/work_order`;

export default {

  getWorkOrderTreeList(): AxiosResult<WorkOrder> {
    const uid: string = (JSON.parse(sessionStorage.getItem("user") as string) as any).id
    if (!uid) {
      return;
    }

    return request.get(`${workOrderTreeUrl}/${uid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

  },

};
