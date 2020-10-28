<template>
  <div class="container">
    <a-form-model
      layout="inline"
      :model="params"
      class="param"
      ref="param">
      <a-form-model-item class="form-item">
        <a-input
          v-model="params.title"
          style="top: -2px"
          class="param-width"
          placeholder="请输入标题摘要"
          allowClear/>
      </a-form-model-item>
      <a-form-model-item class="form-item">
        <a-select
          v-model="params.urgency_degree"
          placeholder="请选择紧急程度"
          class="param-width"
          allowClear>
          <a-select-option value="一般">
            一般
          </a-select-option>
          <a-select-option value="紧急">
            紧急
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item class="form-item">
        <a-select
          v-model="params.overdue"
          placeholder="请选是否逾期"
          class="param-width"
          allowClear
        >
          <a-select-option value="true">
            是
          </a-select-option>
          <a-select-option value="false">
            否
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item class="form-item">
        <a-select
          v-model="params.status"
          placeholder="请选择状态"
          class="param-width"
          allowClear
        >
          <a-select-option v-for="{code,name} in statusDict" :value="code">
            {{ name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item class="form-item">
        <a-select
          v-model="params.tree_level"
          placeholder="请选择子工单显示层级"
          class="param-width"
          allowClear
        >
          <a-select-option :value="1">
            一级
          </a-select-option>
          <a-select-option :value="2">
            二级
          </a-select-option>
          <a-select-option :value="3">
            三级
          </a-select-option>
          <a-select-option :value="-1">
            所有
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item class="form-item">
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
    <div class="table" ref="table" :style="{height: tableHeight}">
      <a-spin
        size="large"
        :spinning="loading"
        v-if="loading"
        class="spinner"
      />
      <a-table
        v-else
        :columns="calcColums"
        :data-source="workOrders"
        :rowKey="record => record.id"
        :loading="loading"
        :indentSize="12"
      >
        <!-- 标题摘要渲染 -->
        <template slot="titleRender" slot-scope="text,row">
          <span v-if="row['transDepartment'] == true" class="work-order-type cooperation">协作</span>
          <span v-if="row['transDepartment'] == false" class="work-order-type internal">内部</span>
          <a
            v-if="row['workflowId']"
            :href="`/form/detail?workflowInstanceId=${row['workflowId']}`"
            target="_blank">
            {{ text }}
          </a>
          <span v-else>{{ text }}</span>
        </template>
        <!-- 紧急程度渲染 -->
        <template slot="urgencyRender" slot-scope="value">
          <dict-item :value="value" :data="urgencyDict" tag/>
        </template>
        <!-- 创建人 -->
        <template slot="creatorRender" slot-scope="value">
          <dict-item :value="value" :data="userDict" avatar/>
        </template>
        <!-- 工单状态渲染 -->
        <template slot="statusRender" slot-scope="value">
          <dict-item :value="value" :data="statusDict" tag/>
        </template>
        <!-- 指派给渲染 -->
        <template slot="executorRender" slot-scope="value,row">
          <!--        <div v-if="row['transDepartment']">-->
          <!--          <template v-for="item in row['department']">-->
          <!--            <dict-item :value="item" :data="departmentDict"/>-->
          <!--          </template>-->
          <!--        </div>-->
          <!--        <div v-else>-->
          <template v-for="item in value">
            <dict-item :value="item" :data="userDict" avatar/>
          </template>
          <!--        </div>-->
        </template>
        <!-- 要求完成时间渲染 -->
        <template slot="deadlineRender" slot-scope="value,row">
          <span v-if="value && row['status'] === 'PROCESSING'">
            <a-tag
              v-if="overdueTips(value) == 0"
              color="orange">
              今日到期
            </a-tag>
            <a-tag v-else-if="overdueTips(value) == 1 " color="orange">
              明日到期
            </a-tag>
            <a-tag v-else-if="overdueTips(value) < 0 " color="red">
              逾期 {{ Math.abs(overdueTips(value)) }} 天
            </a-tag>
            <span v-else>{{ value }}</span>
          </span>
          <span v-else-if="value">{{ value }}</span>
          <span v-else>-</span>
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
import OAuthApi from "../../src/apis/oauth";
import ExtApi from '../apis/extapi'
import {Component, Prop, Vue} from "vue-property-decorator";
import {WorkOrder, WorkOrderType, WorkOrderQuery} from "../types/WorkOrder";
import {Column} from "ant-design-vue/types/table/column";
import DictItem from "./DictItem";
import {DictData} from "../types/data";
import moment from "moment";

@Component({
  name: 'WorkOrderTree',
  components: {
    DictItem
  }
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

  loading: boolean = true;

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
      align: "center",
      ellipsis: true,
      scopedSlots: {customRender: 'creatorRender'},
    }, {
      title: '指派给',
      dataIndex: 'executor',
      ellipsis: true,
      scopedSlots: {customRender: 'executorRender'},
    }, {
      title: '创建时间',
      dataIndex: 'createdTime',
      align: "center",
      width: 200,
    }, {
      title: '要求完成时间',
      dataIndex: 'deadline',
      align: "center",
      width: 200,
      scopedSlots: {customRender: 'deadlineRender'},
    }, {
      title: '状态',
      dataIndex: 'status',
      align: "center",
      scopedSlots: {customRender: 'statusRender'},
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      scopedSlots: {customRender: 'actionsRender'},
    }
  ]

  /* 用户字典 */
  userDict: DictData;

  /* 部门字典 */
  departmentDict: DictData = {};

  /* 紧急程度数据字典 */
  urgencyDict: DictData = {};

  /* 工作流状态数据字典 */
  statusDict: DictData = {};

  /* 表格高度 */
  tableHeight: string = '';

  titleStyleFix: string = '-2px';

  created() {
    // this.getUserInfo();
    this.init().then(() => {
        this.query()
      }
    );
  }

  mounted() {
    const table = this.$refs.table as HTMLElement;
    const param = this.$refs.param as Vue;
    if (table && param) {
      this.tableHeight = `${table.clientHeight - param.$el.clientHeight}px`
    }
  }

  /* 初始化，获取数据字典 */
  async init() {
    return Promise.all([this.getUserDict(), this.getDepartmentDict(), this.getUrgencyDict(), this.getStatusDict()])
  }

  async getUserDict() {
    this.userDict = await ExtApi.getDict('user');
  }

  async getDepartmentDict() {
    this.departmentDict = await ExtApi.getDict('department');
  }

  async getUrgencyDict() {
    // this.urgencyDict = await ExtApi.getDict('urgency_degree');
    this.urgencyDict = await Promise.resolve({
      '一般': {},
      '紧急': {color: 'volcano'}
    } as DictData);
  }

  async getStatusDict() {
    this.statusDict = await ExtApi.getDict('workflow_status');
  }

  /* 获取当前用户信息 */
  getUserInfo() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user") as string) as any
  }

  /* 查询数据 */
  async query() {
    this.loading = true;
    const data = await ExtApi.getWorkOrder(this.workOrderType, this.params)
    // if (this.workOrderType === 'create') {
    //   console.log('我创建的工单', data)
    // } else if (this.workOrderType === 'receive') {
    //   console.log('我收到的工单', data)
    // }
    this.workOrders = data;
    this.loading = false;
  }

  /* 计算属性 */
  get calcColums() {
    if (this.workOrderType === 'create') {
      return this.columns.filter(item => item.dataIndex != 'id')
    }
    return this.columns
  }

  /**
   * 日期相差天数
   * @param dealine
   */
  overdueTips(dealine: string) {
    if (dealine) {
      const now = moment().format('yyyy-MM-DD');
      const end = moment(dealine).format('yyyy-MM-DD');
      const day = moment(end).diff(moment(now), 'days')
      return day;
    }
    return 1;
  }

}
</script>

<style lang="less" scoped>

.container {
  width: 100%;
  height: 100%;

  .param {
    &-width {
      width: 200px;
    }

    .form-item {
      //border: 1px green dashed;
      /deep/ .ant-form-item-control {
        height: 40px;
      }

      /deep/ .ant-select-selection__rendered {
        overflow: visible;
      }
    }
  }

  .table {
    height: 100%;
    padding-top: 16px;
    box-sizing: border-box;
    //border: 1px red dashed;
    overflow: auto;

    .spinner {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

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

  }

  /* 深度选择器，修改组件样式 */

  /deep/ .ant-table-pagination.ant-pagination {
    //border: 1px red dashed;
  }
}


</style>
