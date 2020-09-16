<template>
  <div class="org-user">
    <div
      class="user-tree"
      v-resize.east
    >
      <div class="role-operation" v-if="isCloudPivot">
        <div class="role-btn add-role-group" @click="importDepartment()">
          <i class="icon aufontAll h-icon-all-download-o"></i>
          <span>{{ $t('languages.ImportDepartment') }}</span>
        </div>
        <div class="role-line"></div>
        <div class="role-btn add-role" @click="exportDepartment()">
          <i class="icon aufontAll h-icon-all-upload-o"></i>
          <span>{{ $t('languages.ExportDepartment') }}</span>
        </div> 
      </div>
      <export-dept
        v-if="isShowExportDept"
        :isShowExportDept="isShowExportDept"
        @cancel="cancel"
      ></export-dept>
      
      <div class="search-wrap">
        <a-input
          :placeholder="$t('languages.PlaceHolder.SearchByName')"
          class="input-search"
          v-model="searchText"
          @pressEnter="onSearch"
        >
          <a-icon
            class="suffix-icon close-icon"
            v-if="searchText.length > 0 "
            slot="suffix"
            type="close-circle"
            @click="clearKeyword"
          />

          <a-icon
            class="suffix-icon"
            type="search"
            slot="suffix"
            @click="onSearch"
          />
        </a-input>
      </div>
      <a-tree
        v-if="orgTree && orgTree.length"
        class="tree"
        :defaultExpandedKeys="expandedKeys"
        :treeData="orgTree"
        @expand="getChildrenNodes"
        @select="getUserList"
      />
    </div>
    <div class="user-table">
      <div class="user-title search__input" >
        <h2 v-if="!isSearchTitle">
          <div class="title-limit">{{ unitTitleObj.name }}</div>&nbsp;&nbsp;&nbsp;
          <!-- <span>{{ `ID：${unitTitleObj.id}` }}</span> -->
          <a-popover
            placement="rightTop"
            trigger="click"
            :visible="isShowPop"
            overlayClassName="dept-popover"
            @visibleChange="onVisibleChange($event)"
          >
            <template slot="content">
              <p @click="copyID(unitTitleObj.id)">复制 ID</p>
              <p v-if="isCloudPivot && unitTitleObj.id !== rootId" @click="showDepartment(1, unitTitleObj)">编辑</p>
              <p v-if="isCloudPivot && unitTitleObj.id !== rootId" @click="deleteDepartment">删除</p>
            </template>
            <i class="icon aufontAll h-icon-all-setting-o edit"></i>
          </a-popover>
        </h2>
        <div class="add-operation" v-if="isCloudPivot && !isSearchTitle">
          <a-button
            class="user-btn"
            type="default"
            @click="importPerson">
            <i class="icon aufontAll h-icon-all-download-o"/>{{ $t('languages.ImportPerson') }}
          </a-button>
          <a-button
            class="user-btn"
            type="default"
            @click="exportPerson()">
            <i class="icon aufontAll h-icon-all-upload-o"/>{{ $t('languages.ExportPerson') }}
          </a-button>
          <a-button @click="showDepartment(0)"><a-icon type="plus"/>新建部门</a-button>
          <a-button type="primary" @click="showUser(0)"><a-icon type="plus"/>新建用户</a-button>
        </div>
      </div>
      <div v-if="isSearchTitle" class="search-title">{{ searchTitle }}</div>
      <div class="empty-box" v-show="noUser && !orgUserList.length">
        <img
          class="user-empty"
          src="../../assets/images/userEmpty.png"
        />
        <div>{{ $t('languages.NoUser') }}</div>
      </div>
      <div
        v-show="orgUserList.length"
        class="table-wrap"
      >
        <a-table
          class="user-list"
          :class="{'scroll-bottom':!bottom}"
          :columns="tableColums"
          :dataSource="orgUserList"
          :rowSelection="rowSelection"
          :pagination="false"
          :loading="loading"
          size="small"
          :scroll="{ y: 430 }"
          :customRow="onRowClick"
          @onBodyScroll="onTableBodyScroll"
          :rowKey="record => record.id"
        >
          <span
            slot="indexTitle"
            style="font-weight: 600; white-space: nowrap"
          >{{ $t('languages.NO') }}</span>
          <span
            slot="nameTitle"
            class="resize"
          >{{ $t('languages.Name') }}</span>
          <span
            slot="roleNameTitle"
            class="resize"
          >{{ $t('languages.Roles') }}</span>
          <span
            slot="mobileTitle"
            class="resize"
          >{{ $t('languages.User.MobilePhone') }}</span>
          <span
            slot="emailTitle"
            class="resize"
          >{{ $t('languages.User.Email') }}</span>
          <span
            slot="operationTitle"
            class="resize"
          >{{ $t('languages.Operation') }}</span>

          <p
            slot="name"
            class="cursor text-ellipsis"
            slot-scope="text,record"
          >
            <a-tooltip placement="top">
              <template v-if="record.leader" slot="title">
                <span>{{ $t('languages.User.Manager') }}</span>
              </template>
              <span v-if="searchKey">
                <template v-for="(fragment, i) in text.split(new RegExp(`(${searchKey})|(?=${searchKey})`, 'i'))">
                  <span
                    v-if="fragment.toLowerCase() === searchKey.toLowerCase()"
                    :key="i"
                    class="highlight"
                  >{{ fragment }}</span>
                  <template v-else>{{ fragment }}</template>
                </template>
              </span>
              <span v-else>{{ text }}</span>
            </a-tooltip>
            <span v-if="record.leader" class="aufontAll h-icon-all-star star"></span>
            <template v-if="!record.isAuthUser">
              <a-tooltip>
                <template slot="title">已禁止该用户登录晶奇</template>
                <span class="aufontAll h-icon-all-lock-o lock"></span>
              </a-tooltip>
            </template>
          </p>

          <p
            slot="role"
            class="text-ellipsis"
            slot-scope="text"
          >
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ text }}</span>
              </template>
              <span>{{ text }}</span>
            </a-tooltip>
          </p>
          <span
            slot="mobile"
            class="text-ellipsis"
            slot-scope="text"
          >{{ text }}</span>
          <span
            slot="email"
            class="text-ellipsis"
            slot-scope="text"
          >{{ text }}</span>
          <div
            slot="operation"
            slot-scope="text,record"
            class="operation"
            @click.stop="()=>{}"
          >
            <i class="cursor icon aufontAll h-icon-all-work-handover-o" @click.self.stop="showModel(record)"></i>
            <i v-if="isCloudPivot" class="cursor icon aufontAll h-icon-all-edit-o" @click.self.stop="showUser(1, record)"></i>
            <a-dropdown
              v-if="isCloudPivot"
              class="cursor"
              :trigger="['hover']"
            >
              <div class="aufontAll h-icon-all-ellipsis-o table-operation" @click.stop="()=>{}"></div>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <span @click="showPwd(record)">{{ $t('languages.ResetPassWord') }}</span>
                </a-menu-item>
                <a-menu-item key="1">
                  <span @click="deleteUser(record.id)">{{ $t('languages.Delete') }}</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-table>
      </div>
      <div
        v-show="!noUser && bottom"
        class="load-more"
      >
        <span
          v-if="!loading && !loadCompleted"
          @click="loadMore"
        >{{ $t('languages.ClickToLoadMore') }}</span>
        <span v-if="loading && !loadCompleted">{{ $t('languages.LoadMore') }}</span>
        <span class="text" v-if="loadCompleted">{{ $t('languages.HasLoadedAllData') }}</span>
      </div>
    </div>
    <!-- 新增/编辑部门弹窗 -->
    <AddDepartment
      v-model="departmentVisible"
      :deptType="deptType"
      :deptData="deptData"
      @reloadTree="reloadTree"
    ></AddDepartment>

    <!-- 新增/编辑用户弹窗 -->
    <AddUser
      v-model="userVisible"
      :userType="userType"
      :userData="userData"
      @reloadUser="reloadUser"
      @watchChild="parentReceive"
      @reloadTree="reloadTree"
    ></AddUser>

    <!-- 重置密码弹窗 -->
    <ResetPassword v-model="pwdVisible" :userData="pwdData"></ResetPassword>

    <!-- 工作交接弹框 -->
    <a-drawer
      :title="$t('languages.TaskTransfer.TaskTransfer', { name: userName })"
      width="850"
      placement="right"
      @close="onClose"
      :closable="true"
      :visible="visible"
      wrapClassName="task-transfer-drawer"
      :destroyOnClose="true"
    >
      <TaskTransfer :userid="userid"></TaskTransfer>
    </a-drawer>

    <!--用户信息弹框-->
    <a-drawer
      :title="$t('languages.User.UserInformation')"
      width="850"
      placement="right"
      @close="onCloseInfoModal"
      :closable="true"
      :visible="infoVisible"
      wrapClassName="user-info-drawer"
    >
      <UserInfo></UserInfo>
    </a-drawer>

    <!-- 导入弹窗-->
    <a-modal
      class="import-modal"
      v-model="isShowImportModal"
      :title="importTitle"
      @cancel="handleCancel"
      :width="552"
      :destroyOnClose="true"
      :footer="null"
      :mask="true"
      :maskClosable="false"
      :keyboard="false"
    >
      <data-upload
        v-if="showUploadModel"
        @change="changeImportBtnStatus"
        @setFileName="setImportFileName"
        :importType="importType"
      ></data-upload>
             
      <data-import
        v-if="showImportModel"
        :percent="importPercent"
        :status="importStatus"
        :text="importStatusText"
        @importEnd="importEndFn"
      ></data-import>

      <data-info
        v-if="isShowDataInfo"
        :info="importErrInfo"
      >
      </data-info>

      <!-- 模态框页脚按钮 -->
      <div class="modal-footer">
        <a-button
          v-if="showCancelButton"
          key="back"
          @click="handleCancel"
        >{{ $t('languages.Cancel') }}</a-button>
        <a-button
          v-if="showUploadModel"
          key="import"
          type="primary"
          :disabled="!canImport"
          @click="confirmImport"
        >{{ $t('languages.Modal.StartImport') }}</a-button>
        <a-button
          v-if="showReImport"
          key="import"
          type="primary"
          @click="reImport"
        >重新导入</a-button>
        <a-button
          v-if="showConfirmButton"
          key="confirm"
          type="primary"
          @click="handleCancel"
        >{{ $t('cloudpivot.list.pc.OK') }}</a-button>
      </div>
    </a-modal> 
    <!-- 导入弹窗-->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import * as orgApi from '@/apis/organization';
import OrgApi from '@/apis/organization';

import TaskTransfer from '../../components/organization/taskTransfer/index.vue';
import UserInfo from '../../components/organization/userInfo.vue';

import DataUpload from './import/data-upload.vue';
import DataImport from './import/data-import.vue';
import DataInfo from './import/data-info.vue';
 
enum ImportModalCons {
  upload = 'upload',
  import = 'import',
  info = 'info'
}

enum ImportType {
  department = "department",
  person = "person"
}

// 导出部门组件
import ExportDept from './import/export-dept.vue';

import AddDepartment from '../../components/organization/userModals/department.vue';
import AddUser from '../../components/organization/userModals/user.vue';
import ResetPassword from '../../components/organization/userModals/reset-password.vue';

import { listParams } from '@cloudpivot/api';
const UserModule = namespace('Organization/User');

@Component({
  name: 'OrgUser',
  components: {
    TaskTransfer,
    UserInfo,
    DataUpload,
    DataImport,
    ExportDept,
    DataInfo,
    AddDepartment,
    AddUser,
    ResetPassword
  }
})
export default class OrgUser extends Vue {
  @UserModule.State('orgTree') orgTree: any;

  @UserModule.State('loading') loading: any;

  @UserModule.State('noUser') noUser: any;

  @UserModule.State('unitTitleObj') unitTitleObj: any;

  @UserModule.State('searchTitle') searchTitle: any;

  @UserModule.State('orgUserList') orgUserList: any;

  @UserModule.State('loadCompleted') loadCompleted: any;

  @UserModule.Mutation('clearUserList') clearUserList: any;

  @UserModule.Mutation('setDataRef') setDataRef: any;

  @UserModule.Mutation('changeTitle') changeTitle: any;

  @UserModule.Mutation('assignUserInfoParams') assignUserInfoParams: any;

  @UserModule.Mutation('setEduUserInfoParams') setEduUserInfoParams: any;

  @UserModule.Mutation('clearUserInfo') clearUserInfo: any;

  @UserModule.Mutation('clearOrgTree') clearOrgTree: any;

  @UserModule.Action('getOrgNodes') getOrgNodes: any;

  @UserModule.Action('getOrgUserList') getOrgUserList: any;

  @UserModule.Action('getOrgUserInfo') getOrgUserInfo: any;

  tableColums = [
    {
      dataIndex: 'index',
      align: 'center',
      width: 60,
      slots: { title: 'indexTitle' }
    },
    {
      width: 151,
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      onFilter: (value: string, record: any) => record.name.toLowerCase().includes(value.toLowerCase())
    },
    {
      width: 144,
      dataIndex: 'roleName',
      slots: { title: 'roleNameTitle' },
      scopedSlots: { customRender: 'role' }
    },
    {
      width: 134,
      dataIndex: 'mobile',
      slots: { title: 'mobileTitle' },
      scopedSlots: { customRender: 'mobile' }
    },
    {
      dataIndex: 'email',
      slots: { title: 'emailTitle' },
      scopedSlots: { customRender: 'email' }
    },
    {
      width: 120,
      dataIndex: 'operation',
      slots: { title: 'operationTitle' },
      scopedSlots: { customRender: 'operation' }
    }
  ];

  page: number = 0;

  pageId: string = '';

  searchKey: string = '';

  searchText: string = '';

  userid: string = '';

  userName:string = '';

  visible: boolean = false;

  infoVisible: boolean = false;

  isSearchTitle: boolean = false;

  slideToBottom: boolean = false;

  bottom: boolean = false;

  isShowImportModal: boolean = false; // 弹窗是否显示

  canImport: boolean = false; // 控制导入按钮置灰

  importFileName: string = '';

  curListCode:string = '';

  isUploading: boolean = false;

  isShowExportDept: boolean = false;
  rowSelection = {
    type: 'checkbox',
    selectedRowKeys: new Array<string>(),
    onChange: this.onSelectChange
  };
  importTitle:string= '';
  /**** 导入数据 start *****/
  // 导入-进度条
  showImportModel:boolean = false;
  
  // 导入-选择文件
  showUploadModel:boolean = true;

  // 导入-错误信息
  isShowDataInfo:boolean = false;

  // 导入进度
  importPercent:number = 0;

  simulateInterval:any = -1;

  // 是否导入完成
  isImportEnd:boolean = false;

  // 导入进度条状态
  importStatus:string = 'active';

  // 导入状态文本
  importStatusText:string = '导入中';

  // 导入的错误信息
  importErrInfo:any = {}

  importType:string = '';

  showCancelButton:boolean = true;

  showConfirmButton:boolean = false;

  showReImport:boolean = false;
  /**** 导入数据 end *****/

  isShowPop: boolean = false;

  departmentVisible:boolean = false;

  deptType:number = 0;

  deptData:any = {};

  userVisible:boolean = false;

  userType:number = 0;

  userData:any = {};

  pwdVisible:boolean = false;

  pwdData:any = {};

  isCloudPivot:any = false;

  created() {
    this.page = 0;
    const params: Organization.Users.OrgUserListParams = {
      deptId: '',
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.getOrgNodes({ deptId: '', filterType :'admin' });
    this.getOrgUserList({ params });

    this.getCloudPivot(); //获取晶奇自主维护状态
  }

  /** 
   *  晶奇自主维护状态
  */
  getCloudPivot () {
    let self = this;
    if(self.$store && self.$store.state.config.isCloudPivot) {
      self.isCloudPivot = self.$store.state.config.isCloudPivot;
      console.log(self.isCloudPivot );
    }else{
      setTimeout(this.getCloudPivot, 100)
    }
  }

  destroyed() {
    // destroy时重置用户列表数据及组织机构树
    this.clearOrgTree();
    this.clearUserList();
  }

  // 勾选                                                                                                                                                                                                                 
  onSelectChange(selectedRowKeys) {
    this.rowSelection.selectedRowKeys = selectedRowKeys
  }

  get expandedKeys() {
    const res:any[] = [];
    res.push(this.orgTree[0].key);
    return res;
  }
  
  get rootId() {
    if (this.orgTree && this.orgTree.length) {
      return this.orgTree[0].id;
    }
  }

 

 // 导入组件是否展示
  // get showImportModel() { 
  //   //return this.isImporting;
  //   return false
  // }

  // 改变导入按钮状态
  changeImportBtnStatus(status: boolean) {
    this.canImport = status;
  }
    //设置导入名称
  setImportFileName(fileName: string) {
    this.importFileName = fileName;
  }

    //导入人员按钮
   importPerson(){
    this.importTitle = '导入人员';
    this.importType = ImportType.person;
    this.isShowImportModal = true;
   }


   /**
   * 导出人员操作
   */
  async exportPerson() {
    let usersParam:any = {
      deptId:this.unitTitleObj.id,
      userIds:[]
    };
    if(this.rowSelection.selectedRowKeys.length === 0) { // 用户没有选中任何人员 导出当前节点所有人员
      usersParam.userIds = [];
    } else { // 导出已选中的人员
      // usersParam = this.orgUserList.filter(item => this.rowSelection.selectedRowKeys.includes(item.id));
      usersParam.userIds =  this.rowSelection.selectedRowKeys
    }

    // @ts-ignore
    const res: any = await OrgApi.exportUser( usersParam );
    if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
       this.$message.error(this.$t('languages.Modal.DownloadFailed'));
    } else {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const timer = this.dateFtt(new Date());
      let fileName = `人员导出${timer}.xlsx`;
      this.downloadFile(blob, fileName);
    }
  }

    /**
   * 时间标准化 
  */
  dateFtt(date, fmt = 'YYYYMMDDHHmmss') { 
    var o = {
      "M+": date.getMonth() + 1,     //月份 
      "DD+": date.getDate(),     //日 
      "HH+": date.getHours(),     //小时 
      "m+": date.getMinutes(),     //分 
      "s+": date.getSeconds(),     //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds()    //毫秒 
    };
    if (/(Y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  /**
   * 文件下载方法
   */
  downloadFile(blob: any, fileName: string) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.download = fileName;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
 

  // 导入部门按钮
  importDepartment() {
    this.importTitle = '导入部门';
    this.importType = ImportType.department;
    this.isShowImportModal = true;
  }
  
  // 导出部门按钮
   exportDepartment() {
    this.isShowExportDept = true;
    
  } 

  resetImportData(){
    this.showImportModel = false;

    this.showUploadModel = true;

    this.isShowDataInfo = false;

    this.importPercent = 0;

    this.simulateInterval = -1;

    this.isImportEnd = false;

    this.importStatus = 'active';

    this.importStatusText = '导入中';

    this.importErrInfo = {};

    this.importType = '';

    this.showCancelButton = true;

    this.showConfirmButton = false;

    this.showReImport = false;

    this.canImport = false;
  }

  //取消
  handleCancel() {
      this.isShowImportModal = false;
      setTimeout(() => {
        clearInterval(this.simulateInterval);
        this.resetImportData();
      }, 100);
  }

  /**
   * @desc 展示导入框的内容
   * @model string 需要展示的模块 upload import info
   * */ 
  showImportModalContent(model:string = 'upload'){
    if (model === 'upload') {
      this.showUploadModel = true;
      this.showImportModel = false;
      this.isShowDataInfo = false;
    } else if (model === 'import') {
      this.showUploadModel = false;
      this.showImportModel = true;
      this.isShowDataInfo = false;
    } else if (model === 'info') {
      this.showUploadModel = false;
      this.showImportModel = false;
      this.isShowDataInfo = true;
    } 
  }

  reImport(){
    this.resetImportData();
    this.showImportModalContent(ImportModalCons.upload);
  }

  //确认导入
  async confirmImport() {
    // this.showImportModalContent(ImportModalCons.import)
    const { importFileName, importType } = this;
    let importRes:any;

    if (importType === ImportType.department) {
      importRes = await orgApi.importDepartment(importFileName);
    } else {
      importRes = await orgApi.importPerson(importFileName);
    }
    if (importRes.errcode !== 0) { // 有错误
        const { data } = importRes;
        if (data.errorType === 999999)  { // 网络错误
          this.importPercent = 75;
          this.importStatus = 'exception';
          this.importStatusText = '网络出现异常，导入失败！请重新导入';
          this.showReImport = true;
          this.showImportModalContent(ImportModalCons.import);
          return;
        }
        this.showImportModalContent(ImportModalCons.info);
        this.importErrInfo = importRes.data;
      } else {
        this.showImportModalContent(ImportModalCons.import);
        this.showCancelButton = false;
        this.simulateImport();
      }

    // 1. 导入开始 先模拟一下进度条
    // this.simulateImport();

    // // 2. 3s之后开始调接口
    // setTimeout(async() => {
      
    //   const importRes:any = await orgApi.importDepartment(importFileName);
    //   console.log(importRes);
    //   this.isImportEnd = true;

    //   // 3. 设置状态 or 展示错误信息
    //   this.importPercent = 100;
    //   this.importStatus = 'success';
    //   this.showImportModalContent('info');
    // }, 3000);

    //  this.isInitView = false;
    // this.isUploading = false;
    // this.import(); 
  }

  // 0 ok else err
  /**
   * operationResult: false
      successCount: null
      errorCount: null
      retryCount: null
      fileName: null
      errorType: 4
      secondImportData: null
      headColumns: null
      queryField: null
      data: null
      errorMsg: "Excel表格列头与示例文件不一致"
   * */ 
  // 导入结束 无论成功失败
  importEndFn(data){
    clearInterval(this.simulateInterval);
    if (!data)  return;
    const { errorType } = data;
    if (errorType === 0)  {
      this.importPercent = 100;
      this.importStatus = 'success';
      this.importStatusText = '导入成功';
    } else {
      this.showImportModalContent(ImportModalCons.info);
      this.importErrInfo = data;
      this.showConfirmButton = true;
    }
    this.reloadTree();
  }

  simulateImport() {
    let percent = 1;
    this.simulateInterval = setInterval(() => {
      if (!this.isImportEnd) {
        if (percent <= 90) {
          percent += this.random(5);
          this.importPercent = percent;
        }
      } else {
        clearInterval(this.simulateInterval);
      }
    }, 1500);
  }

  /**
   * 产生随机整数
  */
  random(num: number) {
    return Math.ceil(Math.random() * 5);
  }


  cancel() {
    this.isShowExportDept = !this.isShowExportDept;
  }

  // 展开组织树节点
  getChildrenNodes(expandedKeys: any, e: any) {
    // 已展开的节点不再请求
    if (e.expanded && !e.node.dataRef.children) {
      const param: Organization.Users.OrgTreeParams = {
        deptId: e.node.dataRef.id,
        filterType :'admin'
      };
      this.setDataRef({ dataRef: e.node.dataRef });
      this.getOrgNodes(param);
    }
  }

  onTableBodyScroll(e:any) {
    const tableBody = e.target;
    const bodyClientHeight = tableBody.clientHeight;
    const bodyScrollHeight = tableBody.scrollHeight;
    const bodyScrollTop = tableBody.scrollTop;
    this.slideToBottom = bodyClientHeight + bodyScrollTop === bodyScrollHeight;
    if (bodyClientHeight + bodyScrollTop === bodyScrollHeight) {
      this.bottom = true;
    } else if (bodyClientHeight + bodyScrollTop + 32 <= bodyScrollHeight) {
      this.bottom = false;
    }
  }

  // 点击组织树节点获取用户列表
  getUserList(selectedKeys: any, e: any) {
    if (this.loading) {
      return;
    }
    // 在点击树节点时，（展开/收缩）组织树节点触发getChildrenNodes方法
    if (e.node.$el && e.node.$el.children[0]) {
      e.node.$el.children[0].click();
    }

    this.slideToBottom = false;
    this.bottom = false;
    this.isSearchTitle = false;
    this.changeTitle({ 
      name: e.node.dataRef.name,
      id: e.node.dataRef.id,
      deptType: e.node.dataRef.deptType,
    });
    this.searchKey = '';
    this.pageId = e.node.dataRef.id;
    this.page = 0;
    const userListParam: Organization.Users.OrgUserListParams = {
      deptId: e.node.dataRef.id,
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.clearUserList();
    this.getOrgUserList({ params: userListParam });
    this.rowSelection.selectedRowKeys = [];
  }

  // 加载更多
  loadMore() {
    this.page = this.page + 1;
    if (!this.searchKey) {
      // 组织机构用户列表的加载更多
      const loadMoreParam: Organization.Users.OrgUserListParams = {
        deptId: this.pageId,
        page: this.page,
        size: 100,
        filterType :'admin'
      };
      this.getOrgUserList({ params: loadMoreParam });
    } else {
      // 组织机构搜索的用户列表加载更多
      const loadSearchParam: Organization.Users.SearchUserListParams = {
        wd: this.searchKey,
        page: this.page,
        size: 100,
        filterType :'admin'
      };
      this.getOrgUserList({ params: loadSearchParam, isSearch: true });
    }
  }

  // 清空搜索关键字
  clearKeyword() {
    this.searchKey = '';
    this.searchText = '';
    this.isSearchTitle = false;
    this.clearUserList();
    const params: Organization.Users.OrgUserListParams = {
      deptId: this.pageId,
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.getOrgUserList({ params });
  }

 
  parentReceive(){
    this.clearKeyword();
  }

  // 按用户名搜索
  onSearch() {
    // value为空或数据正在加载中时，不允许请求
    this.searchText = this.searchText.trim();
    if (this.searchText === '' || this.loading) {
      return;
    }
    this.searchKey = this.searchText;
    this.page = 0;
    const searchParam: Organization.Users.SearchUserListParams = {
      wd: this.searchText,
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.isSearchTitle = true;
    this.clearUserList();
    this.getOrgUserList({ params: searchParam, isSearch: true });
  }

  // 工作交接弹框
  showModel(val: any) {
    this.visible = true;
    this.userid = val.id;
    if (val.name) {
      this.userName = val.name;
    }
  }

  onClose() {
    this.visible = false;
  }

  /* 用户信息相关 */
  showInfoModal(val: string) {
    if (val) {
      const infoParams:Organization.Users.RequestParams = {
        id: val
      };
      this.assignUserInfoParams(infoParams);
      let isHomeSchool = false;
      if (this.unitTitleObj.deptType) {
        isHomeSchool = this.unitTitleObj.deptType === 2 && !this.isSearchTitle;
        const params:Organization.Users.EduRequestParams = {
          userId: val,
          deptId: this.unitTitleObj.id
        };
        this.setEduUserInfoParams(params);
      }
      this.getOrgUserInfo(isHomeSchool).then(() => {
        this.infoVisible = true;
      });
    }
  }

  onCloseInfoModal() {
    this.infoVisible = false;
    this.clearUserInfo();
  }

  onRowClick(record:any, index: number) {
    return {
      on: {
        click: () => {
          this.showInfoModal(record.id);
        }
      }
    };
  }

  /* 
  * popover显示控制
  */
  onVisibleChange(visible: boolean) {
    this.isShowPop = visible;
  }

  /* 
  * 复制ID到剪贴板
  */
  copyID(str:string) {
    this.isShowPop = false;
    const content = document.createElement("input"); 
    content.setAttribute("value", str);
    document.body.appendChild(content); 
    content.select();
    document.execCommand("copy");
    document.body.removeChild(content);
    this.$message.success('已成功复制到粘贴板');
  }

  /* 
  * show（新增/编辑）部门弹窗-- 0：新增，1：编辑
  */
 showDepartment(type: number, node:any) {
   this.isShowPop = false;
   this.deptType = type;
   if (node) {
     this.deptData = node;
   }
   this.departmentVisible = true;
 }

/* 
* 删除部门
*/
 deleteDepartment() {
   this.isShowPop = false;
   const vm:any = this;
   vm.$confirm({
    title: '确定删除此部门吗？',
    okText: vm.$t('languages.Apps.Ok').toString(),
    cancelText: vm.$t('languages.Apps.Cancel').toString(),
    onOk() {
      const params = {
        id: vm.unitTitleObj.id
      };
      OrgApi.deleteDepartment(params).then((res:any) =>  {
        if (res.errcode === 200009 || res.errcode === 200002) {
          vm.$warning({
            title: '检测当前部门下包含子部门和用户，请先删除子部门和用户',
            okText: '知道了',
          });
          return;
        } else if (res.errcode) {
          vm.$message.error(res.errmsg);
          return;
        }

        vm.$message.success('删除部门成功！');
        vm.reloadTree();
      });
    }
  });
 }

 /* 
  * show（新增/编辑）用户弹窗-- 0：新增，1：编辑
  */
 showUser(type: number, node:any) {
   this.userType = type;
   if (node) {
     this.userData = node;
   }
   this.userVisible = true;
 }

/* 
* 删除用户
*/
 deleteUser(id:string) {
   const vm:any = this;
   vm.$confirm({
    title: '确定删除此用户吗？',
    okText: vm.$t('languages.Apps.Ok').toString(),
    cancelText: vm.$t('languages.Apps.Cancel').toString(),
    onOk() {
      const params = { id };
      OrgApi.deleteUser(params).then((res:any) =>  {
        if (res.errcode) {
          vm.$message.error(res.errmsg);
          return;
        }
        vm.$message.success('删除用户成功！');
       // vm.reloadUser(true);
          vm.searchKey = '';
          vm.searchText = '';
          vm.isSearchTitle = false;
          vm.clearUserList();
          vm.reloadTree();
       // vm.clearKeyword();
      });
    }
  });
 }
 
 /* 
  * show重置密码弹窗
  */
 showPwd(data:any) {
   this.pwdData = data;
   this.pwdVisible = true;
 }

/* 
* 重载树
*/
 reloadTree() {
   this.getOrgNodes({ deptId: '', filterType :'admin' });
   setTimeout(()=>{
     this.reloadUser()
   },1000);
 }

/* 
* 重载用户
*/
 reloadUser(curPage?:boolean) {
   let deptId = '';
   if (curPage) {
    deptId = this.unitTitleObj.id;
   }
    this.clearUserList();
    this.page = 0;
    const params: Organization.Users.OrgUserListParams = {
      deptId,
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.getOrgUserList({ params });
 }
}
</script>



<style lang="less" scoped>
@import "../../styles/themes/index.less";
.modal-footer {
      height: 53px;
      line-height: 53px;
      text-align: right;
      margin-bottom: -24px;
      & button + button {
        margin-left: 8px;
        margin-bottom: 0;
      }
    }
.org-user {
  height: calc(100vh - 64px);
  .user-tree {
    width: 224px;
    height: 100%;
    float: left;
    box-shadow: 1px 0px 0px 0px #E8E8E8;
    position: relative;
    text-align: left;
    padding-bottom: 25px;
    .search-wrap {
      width: 100%;
      padding: 0 16px;
      .input-search {
        width: 100%;
        margin-top: 16px;
        margin-bottom: 8px;
        .close-icon {
          color: rgba(0, 0, 0, 0.25);
          margin-right: 12px;
        }
      }
    }
    .tree {
      text-align: left;
      margin-left: 12px;
      padding-bottom: 10px;
      max-height: calc(100vh - 167px);
      overflow: auto;
      /deep/ & > li:first-child{
        padding-top: 5px;
      }
      /deep/ li{
        padding: 8px 0 0 0;
        span.ant-tree-node-content-wrapper{
          &:hover{
            background-color: #E8FCF4;
          }
        }
        span.ant-tree-node-selected{
          background-color: #EEEEEE !important;
          font-weight: 500;
        }
      }
    }
    .role-operation{
      width: 100%;
      height: 32px;
      padding: 8px 16px 16px 16px;
      margin-bottom: 8px;
      line-height: 32px;
      .role-line{
        width: 1px;
        height: 24px;
        float: left;
        background: #D8D8D8;
        margin: 4px 20px 4px 12px;
        line-height: 32px;
      }
      .role-btn{
        font-size: 12px;
        color: @primary-color;
        float: left;
        cursor: pointer;
        width: 40%;
        text-align: center;
        i{
          margin-right: 4px;
          font-size: 10px;
        }
      }
    }
  }
  .user-table {
    margin-left: 224px;
    overflow: scroll;
    padding: 0 24px;
    height: 100%;
    & > div.empty-box {
      text-align: center;
      .user-empty {
        margin: 0px auto;
        margin-top: 150px;
      }
    }
    .search__input {
      display: flex;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: space-between;
      padding-top: 16px;
        h2 {
          font-size: 16px;
          text-align: left;
          font-weight: 500;
          &>span{
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
          }
        } 
        .user-btn{
          margin-left: 8px;
          vertical-align: middle;
          i{
            font-size: 14px;
            margin-right: 8px;
          }
        }
      }
    .table-wrap {
      padding: 2px 0 8px 0;
      .user-list {
        min-width: 670px;
        .cursor {
          cursor: pointer;
          .star{
            color: #FADB14;
            margin-left: 8px;
            font-size: 14px;
          }
          .lock {
            margin-left: 8px;
          }
        }
        .highlight {
          color: @primary-color;
        }
      }
      /deep/ .ant-table-header{
        overflow-x: hidden;
        padding-bottom: 20px !important;
        margin-bottom: -20px !important;
        .ant-table-thead>tr>th{
          color: rgba(0, 0, 0, 0.65);;
        }
      }
      /deep/ .ant-table-body {
        min-height: 43px;
        max-height: calc(100vh - 229px + 12px)!important;
        overflow-x: hidden!important;
        color: rgba(0, 0, 0, 0.85);
        p{
          margin-bottom: 0;
        }
      }
      .scroll-bottom{
        /deep/ .ant-table-body {
          max-height: calc(100vh - 198px + 12px)!important;
        }
      }
    }
    .user-title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      h2{
        font-size: 16px;
        text-align: left;
        font-weight: 500;
        .title-limit{
          display: inline-block;
          max-width: 192px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: bottom;
        }
        // background: #fff;
        // border-bottom: 1px solid #E8E8E8;
        &>span{
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
        }
        .edit{
          cursor: pointer;
        }
      }
      .add-operation{
        &>button{
          margin-left: 8px;
        }
      }
    }
    .search-title{
      text-align: left;
      font-size: 14px;
      opacity: 0.45;
      color: #000;
    }
    .ant-table-small{
        padding: 0;
    }
    .operation{
      i{
        font-size: 14px;
        margin-right: 16px;
      }
    }
    .table-operation{
      display: inline-block;
      font-size: 14px;
      margin-right: 14px;
    }
      .resize{
          white-space: nowrap;
      }
    .load-more{
      text-align: center;
      padding: 6px 0;
      span{
        padding: 11px 0;
        color:rgba(0,0,0,0.45);
        font-weight:400;
        font-size:12px;
        cursor: pointer;
      }
      .text{
        cursor: default;
      }
    }
  }
}
.tree::-webkit-scrollbar {
  width: 0;
  height: 7px;
  background: #fff;
}
.tree::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45);
  border-radius: 4px;
}
</style>

<style lang="less">
.ant-table-body::-webkit-scrollbar,
.ant-table-header::-webkit-scrollbar {
  width: 0;
}
.user-info-drawer {
  .ant-drawer-body {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
.task-transfer-drawer {
  //  z-index: 1051;
  .ant-drawer-body{
    padding: 0px;
  }
}
.dept-popover {
  cursor: pointer;
}
.dept-popover p:first-child{
  border-top: none;
  border-radius: 4px 4px 0 0;
  &:hover {
    &:before {
      content: "";
      display: block;
      width: 8.5px;
      height: 8.5px;
      transform: rotate(45deg);
      background-color: #E8FCF4;
      position: absolute;
      left: 6px;
      top: 12px;
    }
  }
}
.dept-popover .ant-popover-inner-content{
  padding: 0px;
}
.dept-popover p{
  border-top: 1px solid rgba(0,0,0,0.09);
  padding: 5px 16px;
}
.dept-popover p:hover{
  background-color: #E8FCF4;
}
</style>
