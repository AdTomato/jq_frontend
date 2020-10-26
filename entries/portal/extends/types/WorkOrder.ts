export type WorkOrderType = 'create' | 'receive';

export type UrgencyDegree = 'NORMAL' | 'URGENCY'

export type WorkOrderStatus = 'PROCESSING' | 'OVER' | string;

/* 工单查询条件 */
export interface WorkOrderQuery {
  title?: string,
  urgency_degree?: UrgencyDegree,
  overdue?: 'true' | 'false' | string,
  status?: WorkOrderStatus,
  page_number?: number | string;
  page_size?: number | string;
}

/**
 * 工单实体描述,与 java 属性对应
 */
export interface WorkOrder {

  /**
   * 是否跨部门工单
   */
  transDepartment: boolean;

  /**
   * 工单ID
   */
  id: string;

  /**
   * 父工单ID
   */
  parentId?: string;

  /**
   * 标题摘要
   */
  title: string;

  /**
   * 创建人
   */
  creator: string;

  /**
   * 创建时间
   */
  createdTime: string;

  /**
   * 要求完成日期
   */
  deadline?: string;

  /**
   * 开始时间
   */
  startTime: string;

  /**
   * 结束时间
   */
  endTime?: string;

  /**
   * 审批人
   */
  approver?: string[];

  /**
   * 关联部门
   */
  department?: string[];

  /**
   * 执行人
   */
  executor?: string[];

  /**
   * 工单任务接收人（审批人，执行人）
   */
  recipient?: string[];

  /**
   * 工单状态
   */
  status: WorkOrderStatus;

  /**
   * 子工单
   */
  children?: WorkOrder[];

  /**
   * 紧急程度
   */
  urgencyDegree: UrgencyDegree;

  /**
   * 流程实例ID
   */
  workflowId: string;

  /**
   * 任务ID
   */
  workItemId: string;

  [key: string]: any
}
