<template>
  <div>
    <h2>我创建的工单</h2>
    <div v-for="workOrder in createdWorkOrders">
      <div>{{ workOrder }}</div>
    </div>
    <h2>我收到的工单</h2>
    <div v-for="workOrder in recivedWorkOrders">
      <div>{{ workOrder }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import OAuthApi from "@/apis/oauth";
import ExtApi from './apis/extapi'
import {Component, Vue} from "vue-property-decorator";
import {WorkOrder, WorkOrderQuery} from "./types/WorkOrder";

@Component({
  name: 'WorkOrderTree',
})
export default class WorkOrderTree extends Vue {

  /* 查询参数 */
  params?: WorkOrderQuery = {};

  /* 用户信息 */
  userInfo?: any = {};

  /* 创建的工单 */
  createdWorkOrders: WorkOrder[] = [];

  /* 收到的工单 */
  recivedWorkOrders: WorkOrder[] = [];


  created() {
    this.getUserInfo();
    this.query()
  }

  /* 获取当前用户信息 */
  getUserInfo() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user") as string) as any
  }

  /* 获取我创建的工单 */
  async getWorkOrderByCreator() {
    const data = await ExtApi.getWorkOrderByCreator(this.params)
    this.createdWorkOrders = data;
  }

  /* 获取我创建的工单 */
  async getWorkOrderByRecipient() {
    const data = await ExtApi.getWorkOrderByRecipient(this.params)
    this.recivedWorkOrders = res.data;
  }

  /* 查询数据 */
  async query() {
    this.getWorkOrderByCreator()
    this.getWorkOrderByRecipient()
  }
}
</script>

<style lang="less" scoped>

</style>
