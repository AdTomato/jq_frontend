/**
 * 工单实体描述,与 java 属性对应
 */
export interface WorkOrder {
    id: string
    parentId?: string

    children?: WorkOrder[];

    [key: string]: any
}

/* 工单查询条件 */
export interface WorkOrderQuery {
    title: string,
    urgency_degree: 'NORMAL' | 'URGENCY',
    overdue: 'true' | 'false' | string,
    status: 'PROCESSING' | string
}


export type WorkOrderType = 'create' | 'receive';
