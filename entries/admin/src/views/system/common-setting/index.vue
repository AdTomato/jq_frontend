<template>
  <div class="common-setting">
    <div class="common-setting__header">
      <span>常规设置</span>
    </div>
    <div class="common-setting__content">
      <div class="set-support">
        <p>主组织维护方式</p>
        <a-select
          :defaultValue="isCloudPivot"
          style="width: 120px"
          class="set-support-select"
          :value="isCloudPivot"
          :disabled="!this.$store.state.System.User.isJustAdmin"
          @change="handleChange"
        >
          <a-select-option
            :value="item.value"
            :key="item.value"
            v-for="item in setList"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <span class="set-support-tip"> 提示：主组织启用以后不允许再修改主组织维护方式，否则将会导致数据、权限错乱</span>
      </div>
      <template v-if="!isCloudPivot">
        <a-steps
          direction="vertical"
          :current="-1"
          class="common-setting__step"
        >
          <a-step id="app-list1">
            <div class="common-setting__dingtalk" slot="description">
              <check-dingtalk>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </check-dingtalk>
            </div>
          </a-step>
          <!--     <a-step id="app-list4">
            <div class="common-setting__dingtalk" slot="description">
              <syn-redirect-url>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </syn-redirect-url>
            </div>
          </a-step> -->
          <a-step id="app-list2">
            <div class="common-setting__dingtalk" slot="description">
              <portal-setting>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </portal-setting>
            </div>
          </a-step>
          <a-step id="app-list3">
            <div class="common-setting__dingtalk" slot="description">
              <file-storage>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </file-storage>
            </div>
          </a-step>
        </a-steps>
      </template>

      <template v-else>
        <a-steps
          direction="vertical"
          :current="-1"
          class="common-setting__step"
        >
          <a-step id="app-list1">
            <div class="common-setting__dingtalk" slot="description">
              <div class="set-corp-name">
                <a-row class="corp-name">
                  <a-col :span="5">
                    <span class="required">*</span>
                    <span>企业名称</span>
                  </a-col>
                  <a-col :span="10">
                    <a-input v-model="cropName"/>
                  </a-col>
                </a-row>

                <a-row v-if="this.$store.state.System.User.isJustAdmin">
                  <a-col :span="5"></a-col>
                  <a-col :span="10">
                    <a-button type="primary" @click="setCropName">保存</a-button>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-step>
          <a-step id="app-list2">
            <div class="common-setting__dingtalk" slot="description">
              <file-storage>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </file-storage>
            </div>
          </a-step>
        </a-steps>
      </template>
      <!-- <div class="common-setting__border"></div>
      <div class="common-setting__storage" id="app-list4">
        <file-storage/>
      </div> -->
      <!-- <div class="common-setting__dingtalk">
        <check-dingtalk/>
      </div>
      <div class="common-setting__border"></div>
      <div class="common-setting__portal">
        <portal-setting/>
      </div>
      <div class="common-setting__border"></div>
      <div class="common-setting__storage">
        <file-storage/>
      </div> -->
    </div>

    <a-modal
      :visible="showGuide"
      width="418px"
      :centered="true"
      class="common-setting__guide"
      :okText="'下一步'"
      @ok="doGuide"
      :maskClosable="false"
      :keyboard="false"
    >
      <div class="guide__wrap clearfix">
        <div class="guide__wrap--img">
          <img src="@/assets/images/welcomeBpm.png"/>
        </div>
        <p class="guide__wrap--tips">
          Hi，欢迎进入晶奇系统， 为了您在使用过程中得到更好的体验， 请先跟着我配置信息。
        </p>
      <!-- <div class="guide__wrap--tips">

      </div> -->
      </div>
    </a-modal>

    <a-drawer
      title="配置规则"
      width="560"
      :visible="showDrawer"
      @close="ShowConfigRule"
    >
      <config-rule/>
    </a-drawer>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import h3Intro from '@/utils/introjs/h3-intro';
import CheckDingtalk from './check-dingtalk.vue';
import FileStorage from './file-storage.vue';
import PortalSetting from './portal-setting.vue';
import SynRedirectUrl from './syn-redirect-url.vue';
import ConfigRule from './config-rule/index.vue';
import OrgApi from '@/apis/organization';
import Oauth from '@/apis/oauth';
import systemApi from '@/apis/system/system-manager.api';

@Component({
  name: 'common-setting',
  components: {
    CheckDingtalk,
    FileStorage,
    PortalSetting,
    SynRedirectUrl,
    ConfigRule
  }
})
export default class CommonSetting extends Vue {
 showGuide: boolean = false;

 showDrawer: boolean = false;

 cropName: string = '';
 isCloudPivot:any = 0;
//  get isCloudPivot() { // 是否已打开内部维护组织开关
//     return this.$store.state.config.cloudPivot || 0;
//   }
  setVal:any = 0;
  isUpdate: boolean = false;
  setList:Array<any> = [
    {
      label: '钉钉集成维护',
      value: 0
    },
    {
      label: '晶奇自主维护',
      value: 1
    }
  ];
  /**
   * @desc 切换主组织维护放肆
   */
  handleChange(cloudPivotType) {
    // console.log('cloudPivotType', cloudPivotType)
    // this.isCloudPivot = cloudPivotType;
    console.log('tis', this)
    if (this.isUpdate) return  false;
    this.isUpdate = true;
    // @ts-ignore
    systemApi.setCloudProvt({ cloudPivotType }).then(res => {
      let { errcode, errmsg } = res;
      this.isUpdate = false;
      if (errcode === 0) {
        this.isCloudPivot = cloudPivotType;
        Oauth.getSystemConfig().then(config => {
          if (config) {
            this.$store.commit('setConfig', config);
          }
        });
      } else {
        this.$message.error(errmsg);
        
      }
    })
  }
  /* 
  * 设置企业名称
  */
  setCropName() {
    if (!this.cropName) {
      this.$message.warning('请填写企业名称！');
      return;
    }

    const params: any = {
      name: this.cropName
    };
    // @ts-ignore
    OrgApi.setCropName(params).then((res:any) =>  {
      if (res.errcode) {
        this.$message.error(res.errmsg);
        return;
      }
      this.$message.success('保存成功！');
    });
  }

 /**
 * 抽屉显隐的控制
 */
 ShowConfigRule() {
   this.showDrawer = !this.showDrawer;
 }

 /**
  * 指引开始
  */
 doGuide() {
   (window as any).h3Intro.start();
   this.showGuide = false;
 }
getCloudPivot() {
  if ('isCloudPivot' in this.$store.state.config ) {
      this.isCloudPivot = this.$store.state.config.isCloudPivot;
      // 获取企业名称
       // @ts-ignore
     OrgApi.getCropName().then((res:any) =>  {
      if (!res.errcode && res.data) {
        this.cropName = res.data.deptName;
      }
    });
  } else {
    setTimeout(() => this.getCloudPivot(), 100)
  }
  // 设置引导提示信息
  this.showGuide = true;
  const isShowGuide = localStorage.getItem('isNewUser');
  if (!isShowGuide) {
    this.showGuide = true;
    localStorage.setItem('isNewUser', 'toDoGuide');
  } else {
    this.showGuide = false;
  }

  let stepData:any = [];
  if (!this.isCloudPivot) {
    stepData = [
      {
        element: '#app-list1',
        content: '钉钉集成：系统基于钉钉内置使用，系统中组织机构从钉钉同步，需在钉钉中自建应用，\
          并获取应用消息填写在下方，详细配置步骤请查看“配置规则”',
      },
      /* {
        element: '#app-list2',
        content: '增量同步：钉钉中组织修改变更，增量同步到系统中，\
          配置信息保存即可绑定钉钉同步，详细配置步骤请查看“配置规则”'
      },  */
      {
        element: '#app-list2',
        content: '门户访问设置：用户在门户钉钉扫码登录配置，\
          需配置相关信息，详细配置步骤请查看“配置规则”',
        // position: 'right',
      },
      {
        element: '#app-list3',
        content: '文件存储：系统存储文件位置，相关信息从阿里云获取',
        // position: 'right',
      }
    ];
  } else {
    stepData = [
      {
        element: '#app-list1',
        content: '企业名称：系统内本企业的名称，将作为组织机构根节点显示',
      },
      {
        element: '#app-list2',
        content: '文件存储：系统存储文件位置，相关信息从阿里云获取',
      }
    ];
  }

  (window as any).h3Intro = h3Intro({
    stepData
  });
}
 
 /**
   * 生命周期
   */
 mounted() {
   // 更新组织维护配置开关设置参数
   this.getCloudPivot()
 }
}
</script>
<style lang="less" scoped>
.common-setting{
    margin: 0 24px;
    height: 100%;
    &__content{
      .common-setting__step {
       max-width: 700px;
      }
      /deep/.ant-steps-item-description {
        padding-bottom: 24px;
      }
      height: calc(100% - 70px);
      overflow-y: auto;
      padding-left: 10px;
      padding-top: 24px;
      padding-bottom: 64px;
      // position: relative;
    }
    &__header{
        padding: 13px 0;
        text-align: left;
        border-bottom: 1px solid rgba(232,232,232,1);
        span{
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
        }
    }
    &__border{
        border-bottom: 1px solid rgba(232,232,232,1);
        // min-height: 1px;
    }
    &__dingtalk{
      max-width: 700px;
      margin-top: 2px;
      // margin-top: 300px;
      .set-corp-name{
        position: relative;
        padding-left: 5px;
        .required{
          left: -6px;
          color: #f5222d;
          position: absolute;
        }
        .corp-name{
          margin-bottom: 20px;
        }
      }
    }
    &__storage{
        max-width: 740px;
        margin-top: 24px;
    }
    &__portal{
      max-width: 700px;
      margin-top: 24px;
    }
    /deep/&__guide{
      /deep/.ant-modal-close{
        display: none;
      }
    }
    .set-support{
      &{
        display: flex;
        align-items: center;
        font-size:14px;
        margin-bottom: 32px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        line-height:22px;
      }
      .set-support-tip{
        font-size:12px;
        color:rgba(0,0,0,.45);
      }
      .set-support-select{
        margin: 0 16px;
        width: 130px !important;
      }
    }
}
</style>
<style lang="less">
@import '~@/utils/introjs/h3-intro.less';
.common-setting__guide{
  .guide__wrap{
    .guide__wrap--img{
      float: left;
      img{
        width: 82px;
        height: 93px;
      }
    }
    .guide__wrap--tips{
      // float: left;
      margin-left: 108px;
      padding-top: 7px;
      font-size: 16px;
    }
  }
  .ant-modal-close{
    display: none;
  }
  .ant-modal-footer{
    border-top: 0;
  }
  .ant-btn-default{
    display: none;
  }
  .ant-modal-body {
    padding-bottom: 0;
  }
}
</style>
