import Axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {Data} from "../types/WorkOrder";

const service = Axios.create({
  timeout: 5000,
} as AxiosRequestConfig)

service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json'
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token') || ''}`
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  value => {
    debugger;
    const res: AxiosResponse<Data> = value
    if (res.data.errcode === 0) {
      return res.data.data
    } else {
      console.log(res.data.errmsg)
      return Promise.reject(res.data.errmsg)
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
const {request} = service;

export default request;
