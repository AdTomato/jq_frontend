<template>
  <a-modal
    v-model="showModal"
    :title="modalTitle"
    :width="446"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @ok="submit"
    @cancel="cancel"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form class="add-department" :autoFormCreate="(form) => { this.form = form }">
      <a-form-item
        label="上级部门"
        fieldDecoratorId="department"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.department"
      >
        <staff-selector
          :options="deptOpts"
        ></staff-selector>
      </a-form-item>

      <a-form-item
        label="部门名称"
        fieldDecoratorId="deptName"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.deptName"
      >
        <a-input
          class="dept__name"
          maxlength="50"
          placeholder="请输入名称"
        />
      </a-form-item>

      <a-form-item
        v-if="deptType === 1"
        label="部门主管"
        fieldDecoratorId="deptLeader"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <a-select
          allowClear
          showSearch
          placeholder="请选择"
          optionFilterProp="children"
        >
          <a-select-option
            v-for="(user, index) in orgUserList"
            :key="index"
            :value="user.userId"
          >{{ user.name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { pattern, nameValidator } from '@/common/utils';

import { State, namespace } from 'vuex-class';

import OrgApi from '@/apis/organization';

import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';

const UserModule = namespace('Organization/User');

@Component({
  name: "add-department",
  components: {
    StaffSelector
  }
})

export default class AddDepartment extends Vue {
  @UserModule.State('unitTitleObj') unitTitleObj: any;

  @Prop() value!: boolean;

  @Prop() deptType!: number; // 0：新增，1：编辑

  @Prop() deptData!: any;

  showModal: boolean = false;

  modalTitle: string = '新建部门';

  orgUserList:any = [];

  params: any = {
    department: '',
    deptName: '',
    deptLeader: ''
  };

  form: any = {};

  formItemLayout: any = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
    }
  };

  rules: any = {};

  deptOpts:any = {
    selectOrg: true,
    selectUser: false,
    showModel: false,
    mulpitle: false,
    showSelect: true,
    placeholder: '请选择',
    appManagerFilter: true,
    rootNode: []
  }

  beforeMount() {
    this.setRules();
  }

  setRules() {
    this.rules = {
      department: {
        rules: [
          {
            required: true,
            message: '上级部门不能为空'
          }
        ]
      },
      deptName: {
        rules: [
          {
            required: true,
            message: '部门名称不能为空'
          },
          {
            validator: nameValidator,
            message: this.$t('languages.Apps.AppNameRule')
            // 仅限50个字符以内，并不能以空格开头
          }
        ]
      }
    };
  }

  getOrgUserList(id:any) {
    const params = {
      deptId: id,
      page: 0,
      size: 10000, // 暂设10000条，加载全部数据
      filterType :'admin'
    };
    OrgApi.getOrgList(params).then((res:any) =>  {
      if (!res.errcode && res.data && res.data.content) {
        this.orgUserList = res.data.content;
      }
    });
  }

  submit() {
    this.form.validateFields((err: any) => {
      if (!err) {
        const deptName = this.form.getFieldValue('deptName');
        const department = this.form.getFieldValue('department');
        const managerId = this.form.getFieldValue('deptLeader');

        const parentId = department && department.length ? department[0].id : '';

        if (this.deptType === 1) {
          // 编辑部门接口
          const params: any = {
            parentId,
            name: deptName,
            managerId: managerId ? managerId: '',
            id: this.deptData ? this.deptData.id : ''
          };
          OrgApi.updateDepartment(params).then((res:any) =>  {
            if (res.errcode) {
              this.$message.error(res.errmsg);
              return;
            }

            this.$message.success('编辑部门成功！');
            this.$emit('reloadTree');
            this.cancel();
          });
        } else {
          // 新增部门接口
          const params: any = {
            parentId,
            name: deptName
          };
          OrgApi.addDepartment(params).then((res:any) =>  {
            if (res.errcode) {
              this.$message.error(res.errmsg);
              return;
            }

            this.$message.success('创建部门成功！');
            this.$emit('reloadTree');
            this.cancel();
          });
        }
      }
    });
  }

  cancel() {
    this.form.resetFields();
    this.$emit('input', false);
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.showModal = v;
    if (!v) {
      return;
    }
    if (this.deptType === 1) {
      this.modalTitle = '编辑部门';
      this.$nextTick(() => {
        if (this.form.setFieldsValue) {
          this.getOrgUserList(this.deptData.id);
          const deptId = this.deptData.id ? this.deptData.id : '';
          const params = {
            deptId,
          };
          // 获取当前部门的部门主管
          OrgApi.searchDeptDetail(params).then((res: any) => {
            if (!res.errcode && res.data) {
              const detail = res.data;
              this.form.setFieldsValue({
                deptName: detail.deptName,
                department: [{ 
                  name: detail.parentName,
                  id: detail.parentId,
                  unitType: 1
                }],
                deptLeader: detail.managerId ? detail.managerId : '',
              });
            }
          });
        }
      });
    } else {
      this.modalTitle = '新建部门';
      this.$nextTick(() => {
        if (this.form.setFieldsValue) {
          this.form.setFieldsValue({
            department: [{ 
              name: this.unitTitleObj.name,
              id: this.unitTitleObj.id,
              unitType: 1
            }],
          });
        }
      });
    } 
  }

}
</script>

<style lang="less" scoped>
</style>
