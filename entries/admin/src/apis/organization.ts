import Axios from 'axios';
import env from '@/env';
const deparmentPath = '/api/organization/department';
/**
 * 导入部门 or 人员上传地址
 */
const departmentUploadUrl = `${env.apiHost}/api/runtime/query/upload_file`;

export default {
  departmentUploadUrl,

   // 导出部门
  exportDept(params: Organization.Users.ExportDeptParams): any {
    return Axios.post('/api/organization/department/export_dept', params, { responseType: 'arraybuffer' });
  },
   // 导出人员
  exportUser(params: Organization.Users.ExportUserParams): any {
    return Axios.post('/api/organization/department/export_user', params, { responseType: 'arraybuffer' });
  },

  synchronize(): Promise<Common.Response> { // 组织同步
    return Axios.get('/api/dingtalk/synchorize/organization');
  },
  getOrgInfo(params: Organization.Users.OrgTreeParams): Promise<Common.Response> { // 组织机构树
    return Axios.get('/api/organization/department/childs', {
      params
    });
  },
  getOrgDepartmentInfo(params: Organization.Users.OrgTreeParams): Promise<Common.Response> { // 组织机构树[new]
    return Axios.get('/api/organization/department/tree', {
      params
    });
  },
  getOrgList(params: Organization.Users.OrgUserListParams): Promise<Common.Data> { // 组织机构的用户列表
    return Axios.get('/api/organization/department/users', { params });
  },
  searchOrgUserList(params: Organization.Users.SearchUserListParams): Promise<Common.Data> { // 根据用户名搜索组织机构的用户列表
    return Axios.post('/api/organization/user/search', params);
  },
  getRoleLeveOneInfo(expandAll?: boolean): Promise<Common.Response> { // 组织角色
    return Axios.get('/api/organization/role/list', {
      params: {
        expandAll: !!expandAll
      }
    });
  },
  searchRoleList(searchKey: string): Promise<Common.Response> { // 模糊搜索角色列表
    return Axios.get('/api/organization/role/search', {
      params: {
        name: searchKey
      }
    });
  },

  /* 晶奇内部维护组织 start */

  // 新增部门
  addDepartment(params: Organization.Users.DeptRequestParams): Promise<Common.Data> {
    return Axios.post('/api/organization/department/add', params);
  },

  // 编辑部门
  updateDepartment(params: Organization.Users.DeptRequestParams): Promise<Common.Data> {
    return Axios.post('/api/organization/department/modefied', params);
  },

  // 删除部门
  deleteDepartment(params: Organization.Users.RequestParams): Promise<Common.Data> {
    return Axios.get('/api/organization/department/strike_out', { params });
  },

  // 查找部门详情
  searchDeptDetail(params: Organization.Users.OrgTreeParams): Promise<Common.Data> {
    return Axios.get('/api/organization/department/search_dept_detail', { params });
  },

  // 新增用户
  addUser(params: Organization.Users.AddUserRequestParams): Promise<Common.Data> {
    return Axios.post('/api/organization/user/add', params);
  },

  // 编辑用户
  updateUser(params: Organization.Users.AddUserRequestParams): Promise<Common.Data> {
    return Axios.post('/api/organization/user/modify', params);
  },

  // 删除用户
  deleteUser(params: Organization.Users.RequestParams): Promise<Common.Data> {
    return Axios.get('/api/organization/user/strike_out', { params });
  },

  // 重置密码
  resetPassword(params: Organization.Users.RequestParams): Promise<Common.Data> {
    return Axios.get('/api/organization/user/reset_password', { params });
  },

  // 设置企业名称
  setCropName(params: Organization.Users.CropNameRequestParams): Promise<Common.Data> {
    return Axios.get('/api/organization/department/modified_root', { params });
  },

  // 获取企业名称
  getCropName(): Promise<Common.Data> {
    return Axios.get('/api/organization/department/search_root_detail');
  },


  /* 晶奇内部维护组织 end */

  searchRoleUserList(params: Organization.Roles.RequestListParams): Promise<Common.Data> { // 角色下用户名模糊搜索用户
    return Axios.get('/api/organization/role/page/users', {params });
  },
  getOrgRoleList(params: Organization.Roles.RequestListParams): Promise<Common.Data> {
    return Axios.get('/api/organization/role/users', { params }); // 组织table例表
  },
  getChildrenRole(params: Organization.Roles.RequestChildrenTreeParams): Promise<Common.Response> {
    return Axios.get('/api/organization/role/childs', { params }); // 获取子组织角色
  },
  getOrgUserInfo(params: Organization.Users.RequestParams): Promise<Common.Data> {
    return Axios.get('/api/organization/user/info', {
      params
    });
  },
  // 获取家校用户信息
  getEduUserInfo(params: Organization.Users.EduRequestParams): Promise<Common.Data> { 
    return Axios.get('/api/organization/user/eduInfo', {
      params
    });
  },
  getRoleGroup(params: Organization.Roles.RoleGroupParams): Promise<Common.Response> {
    return Axios.get('/api/organization/role/get_rolegroup', {
      params
    });
  },
  getRoleGroupByCode(params: Organization.Roles.RoleGroupByCodeParams): Promise<Common.Response> {
    return Axios.get('/api/organization/role/get_rolegroup_by_code', {
      params
    });
  },
  /**
   * 根据用户id获取工作交接任务
   * @param params 
   */
  getTaskByUser(params: Organization.Roles.LiseTaskByUserParams):Promise<Common.Response> {
    return Axios.get('/api/runtime/workflow/list_user_workitems', {
      params
    });
  },
   /**
   * 根据用户id获取应用数据工作交接数据
   * @param params 
   */
  getBusinessTaskByUser(params: Organization.Roles.BusinessTaskByUserParams):Promise<Common.Response> {
    return Axios.get('/api/runtime/workflow/list_user_business_items', {
      params
    });
  },
  taskTransfer(params: Organization.Roles.TransferParams): Promise<Common.Response> {
    return Axios.post('/api/runtime/workflow/transfer',
      params );
  },

  /**
   * 更新角色管理范围
   * @param params
   */
  updateUserOuscope(params: Organization.Roles.UpdateUserOuscope): Promise<Common.Response> {
    return Axios.put('/api/organization/role/update_ouscope', params);
  },

  getUserOuscope(params: Organization.Roles.GetUserOuscope): Promise<Common.Response> {
    return Axios.get('/api/organization/role/get_ouscope', { params });
  },


  // 错误处理
  errorHandle(res: any) {
    if (res.hasOwnProperty('errcode') && res.errcode !== 0) {
      return Promise.reject(res);
    }
    return res;
  },

  // 下一级-组织树
  getOrgTree(deptIds: any,filterType?:string) {
    return Axios.get(`/api/organization/department/tree`, {
      params: {
        deptIds,
        filterType
      }
    }).then(this.errorHandle);
  },

  // 下一级-用户
  getUsersTree(deptId: string, roleId?: string,filterType?:string) {
    return Axios.get(`/api/organization/department/list_user`, {
      params: {
        deptId,
        roleId,
        filterType
      }
    }).then(this.errorHandle);
  },

  /**
   * 选人控件根据名称搜索人或部门343
   * @param name 
   */
  search(name: string, deptIds?: string, roleIds?: string, filterType?: string) {
    return Axios.get('/api/organization/user/tree/search', {
      params: {
        name,
        deptIds,
        roleIds,
        filterType
      }
    }).then(this.errorHandle);
  },


  // 下一级-角色
  getChildrenRole2(groupId: any) {
    return Axios.get('/api/organization/role/childs', {
      params: {
        groupId
      }
    }).then(this.errorHandle);
  },

  // 新增角色组
  addRoleGroup(params: Organization.roleGroupParams): Promise<Common.Data> {
    return Axios.post('/api/organization/role/add_role_group', params);
  },

  // 新增角色
  addRole(params: Organization.roleParams): Promise<Common.Data> {
  return Axios.post('/api/organization/role/add_role', params);
  },

  // 新增角色下的用户
  addRoleUser(params: Organization.roleUserParams): Promise<Common.Data> {
  return Axios.post('/api/organization/role/add_role_user', params);
  },

  // 更新角色组
  updateRoleGroup(params: Organization.roleGroupParams): Promise<Common.Data> {
  return Axios.put('/api/organization/role/modify_role_group', params);
  },

  // 更新角色
  updateRole(params: Organization.roleParams): Promise<Common.Data> {
  return Axios.put('/api/organization/role/modify_role', params);
  },

  // 删除角色组
  deleteRoleGroup(params: Organization.roleDeleteParams): Promise<Common.Data> {
    return Axios.get('/api/organization/role/strike_out_role_group', { params });
  },

  // 删除角色
  deleteRole(params: Organization.roleDeleteParams): Promise<Common.Data> {
    return Axios.get('/api/organization/role/strike_out_role', { params });
  },

  // 删除角色下的用户
  deleteRoleUser(params: Organization.roleUserDeleteParams): Promise<Common.Data> {
    return Axios.post('/api/organization/role/strike_out_role_user', params);
  },

  // 下载部门导入示例文件
  exportTemplate():any{
    return Axios.get('/api/organization/department/export_template',{ responseType: 'arraybuffer' })
  },

  // 下载人员导入示例文件
  exportPersonTemplate():any{
    return Axios.get('/api/organization/user/export_template',{ responseType: 'arraybuffer'})
  }
};

// 错误处理
export function errorHandle(res: any) {
  if (res.hasOwnProperty('errcode') && res.errcode !== 0) {
    return Promise.reject(res);
  }
  return res;
}

// 下一级-组织树
export function getOrgTree(deptId: any) {
  return Axios.get(`${deparmentPath}/tree`, {
    params: {
      deptId
    }
  }).then(errorHandle);
}
// 下一级-用户
export function getUsersTree(deptId: any) {
  return Axios.get(`${deparmentPath}/users`, {
    params: {
      deptId
    }
  }).then(errorHandle);
}
// 下一级-角色
export function getChildrenRole2(groupId: any) {
  return Axios.get('/api/organization/role/childs', {
    params: {
      groupId
    }
  }).then(errorHandle);
}

/**
 * 选人控件根据名称搜索人或部门
 * @param name 
 */
export function search(name: string) {
  return Axios.get('/api/organization/user/tree/search', {
    params: {
      name
    }
  }).then(errorHandle);
}

// 获取当前用户的信息
export const getUserInfoLogin = (): Promise<Common.Data> => {
  return Axios.get('/api/organization/user/info_login')
}

// 修改超级管理员的密码
export const modifyPassword = (params: Organization.Users.PasswordParams): Promise<Common.Data> => {
  return Axios.put('/api/organization/user/modify_password_by_username', params)
}

// 获取当前用户的所属部门列表
export const getDepartmentList = (params: Organization.Users.RequestParams): Promise<Common.Data> => {
  return Axios.get('/api/organization/user/departments', { params })
}

// 更改当前用户的主部门
export const updateMainDepartment = (params: Organization.Users.UpdateMainParams): Promise<Common.Data> => {
  return Axios.put('/api/organization/user/update_main', params)
}
// 导入部门 
export const importDepartment = (fileName:string):Promise<Common.Data> => {
  return Axios.get('/api/organization/department/import_data', {params: {
    fileName
  }})
}

// 导入人员
export const importPerson = (fileName:string):Promise<Common.Data> => {
  return Axios.get('/api/organization/user/import_data', {params: {
    fileName
  }})
}
