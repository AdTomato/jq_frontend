<template>
  <div>
    <!--    <div>{{ userInfo.id }}</div>-->
    <div v-for="workOrder in workOrders">
      <div>{{ workOrder }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import OAuthApi from "@/apis/oauth";
import ExtApi from './apis/extapi'
import {Component, Vue} from "vue-property-decorator";
import {WorkOrder} from "./types/WorkOrder";

@Component({
  name: 'WorkOrderTree',
})
export default class WorkOrderTree extends Vue {

  /* 用户信息 */
  userInfo: any = {};

  /* 工单信息 */
  workOrders: WorkOrder[] = [];

  created() {
    this.getUserInfo().then(
      () => this.getWorkOrderTreeData()
    )
  }

  /* 获取当前用户信息 */
  async getUserInfo() {
    const res = await OAuthApi.getUserInfo();
    if (res.errcode === 0) {
      this.userInfo = res.data;
    }
  }

  /* 获取工单数据 */
  async getWorkOrderTreeData() {
    const {data: res} = await ExtApi.getWorkOrderTreeList()

    if (res.errcode === 0) {
      this.workOrders = res.data;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
