<template>
  <div style="width: 100%;height: 100%;overflow: scroll">
    <div>
      <a-form-model
        layout="inline"
        :model="params">
        <a-form-model-item>
          <a-input
            v-model="params.title"
            class="param-width"
            placeholder="请输入标题摘要"
            style="top:-2px"
            allowClear/>
        </a-form-model-item>
        <a-form-model-item>
          <a-select
            v-model="params.urgency_degree"
            placeholder="请选择紧急程度"
            allowClear
            class="param-width">
            <a-select-option value="NORMAL">
              一般
            </a-select-option>
            <a-select-option value="URGENCY">
              紧急
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-select
            v-model="params.overdue"
            placeholder="请选是否逾期"
            allowClear
            class="param-width"
          >
            <a-select-option value="true">
              是
            </a-select-option>
            <a-select-option value="false">
              否
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-select
            v-model="params.status"
            placeholder="请选择状态"
            allowClear
            class="param-width">
            <a-select-option value="PROCESSING">
              处理中
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-space :size="8">
            <a-button
              type="primary"
              @click="query"
            >
              查询
            </a-button>
            <a-button @click="params={}">重置</a-button>
          </a-space>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div>
      <a-table :columns="columns" :data-source="workOrders">
        <!-- 标题摘要渲染 -->
        <template slot="titleRender" slot-scope="text,row">
          <span v-if="row['transDepartment'] == true" class="work-order-type cooperation">协作</span>
          <span v-if="row['transDepartment'] == false" class="work-order-type internal">内部</span>
          <span>{{ text }}</span>
        </template>
        <!-- 紧急程度渲染 -->
        <template slot="urgencyRender" slot-scope="value">
          <dict-item :value="value" :data="urgencyDict" tag/>
        </template>
        <!-- 工单状态渲染 -->
        <template slot="statusRender" slot-scope="value">
          <dict-item :value="value" :data="statusDict" tag/>
        </template>
        <!-- 指派给渲染 -->
        <template slot="executorRender" slot-scope="value">
          <div v-for="item in value">
            {{ item }}
          </div>
        </template>
        <template slot="actionsRender" slot-scope="value,row">
          <a-space :size="6">
            <a-button
              size="small"
              shape="round"
              type="primary"
              :href="`/form/detail?startWorkflowCode=workFlowDeptN&pid=${value}`"
              target="_blank"
              ghost>内部
            </a-button>
            <a-button
              size="small"
              shape="round"
              target="_blank"
              :href="`/form/detail?startWorkflowCode=work_flow_k_dept&pid=${value}`"
            >协作
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import OAuthApi from "@/apis/oauth";
import ExtApi from './apis/extapi'
import {Component, Prop, Vue} from "vue-property-decorator";
import {WorkOrder, WorkOrderType, WorkOrderQuery} from "./types/WorkOrder";
import {Column} from "ant-design-vue/types/table/column";
import DictItem from "./components/DictItem.vue";
import {DictData} from "./types/data";

@Component({
  name: 'WorkOrderTree',
  components: {DictItem}
})
export default class WorkOrderTree extends Vue {

  /**
   * 工单类型
   */
  @Prop({
    type: String,
    default: 'create'
  })
  workOrderType: WorkOrderType;

  /* 查询参数 */
  params?: WorkOrderQuery = {};

  /* 用户信息 */
  userInfo?: any = {};

  /* 工单信息 */
  workOrders: WorkOrder[] = [];

  /* 表格展示列 */
  columns: Column[] = [
    {
      title: '标题摘要',
      dataIndex: 'title',
      ellipsis: true,
      scopedSlots: {customRender: 'titleRender'},
    }, {
      title: '紧急程度',
      dataIndex: 'urgencyDegree',
      align: "center",
      width: 90,
      scopedSlots: {customRender: 'urgencyRender'},
    }, {
      title: '创建人',
      dataIndex: 'creator',
      ellipsis: true,
    }, {
      title: '指派给',
      dataIndex: 'executor',
      ellipsis: true,
      scopedSlots: {customRender: 'executorRender'},
    }, {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 200,
    }, {
      title: '要求完成时间',
      dataIndex: 'deadline',
      width: 200,
    }, {
      title: '状态',
      dataIndex: 'status',
      scopedSlots: {customRender: 'statusRender'},
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      scopedSlots: {customRender: 'actionsRender'},
    }
  ]

  /* 紧急程度数据字典 */
  urgencyDict: DictData = {
    DEFAULT: {name: '-'},
    NORMAL: {name: '一般'},
    URGENCY: {name: '紧急', color: 'volcano'}
  }

  /* 工单状态数据字典 */
  statusDict: DictData = {
    DEFAULT: {name: '-'},
    PROCESSING: {name: '处理中', color: 'volcano'}
  }

  created() {
    this.getUserInfo();
    this.query()
  }

  /* 获取当前用户信息 */
  getUserInfo() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user") as string) as any
  }

  /* 查询数据 */
  async query() {
    const data = await ExtApi.getWorkOrder(this.workOrderType, this.params)
    if (this.workOrderType === 'create') {
      console.log('我创建的工单', data)
    } else if (this.workOrderType === 'receive') {
      console.log('我收到的工单', data)
    }
    this.workOrders = data;
  }

}
</script>

<style lang="less" scoped>
.work-order-type {
  font-size: 10px;
  padding: 2px 4px;
  margin-right: 6px;
  border: 1px #c4c4c4 solid;
  border-radius: 12px;

  &.internal {
    border-color: #3296FA;
    color: #3296FA;
  }

  &.cooperation {
    border-color: #FF9F00;
    color: #FF9F00;
  }
}

.param-width {
  width: 200px;
}
</style>
