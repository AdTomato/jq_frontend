<template>
  <div class="popover-wrap">
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DataItem') }}</label>
      </a-col>
      <a-col :span="19">
        <span class="l-h">{{ `${modalData.propertyName || modalData.name}[${modalData.code}]` }}</span>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DisplayName') }}</label>
      </a-col>
      <a-col :span="19">
        <a-input
          :placeholder="$t('languages.Apps.PleaseInputDisplayName')"
          v-if="isChinese"
          v-model="backData.name"
          maxlength="50"
          :class="{'input-error':!backData.name}"
        />
        <a-input
          :placeholder="$t('languages.Apps.PleaseInputDisplayName')"
          maxlength="50"
          v-model="backData.name_i18n[$i18n.locale]"
          v-else
          :class="{'input-error':!backData.name_i18n[$i18n.locale]}"
        />
        <div class="empty-tip" v-if="!backData.name && isChinese">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
        <div class="empty-tip" v-if="!backData.name_i18n[$i18n.locale] && !isChinese">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DisplayType') }}</label>
      </a-col>
      <a-col :span="19">
        <span class="l-h">{{ $t('languages.Apps.ScopeQuery') }}</span>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DefaultValue') }}</label>
      </a-col>
      <a-col :span="19" class="default">
        <div class="select-wrap">
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            v-model="backData.dateType"
            :getPopupContainer="getPopupContainer"
          >
            <a-select-option
              v-for="(option, index) in DateDefaultType"
              :key="index"
              :value="option.type"
            >{{ $t(`languages.Apps.ListControl.${option.text}`) }}</a-select-option>
          </a-select>
        </div>
        <div v-if="backData.dateType === 0">
          <a-date-picker
            showTime
            format="YYYY-MM-DD"
            v-model="backData.startValue"
            :placeholder="$t('languages.Apps.StartTime')"
            :disabledDate="disabledStartDate"
            :getCalendarContainer="getPopupContainer"
            @openChange="handleStartOpenChange"
            class="date"
          />
          <a-date-picker
            class="date"
            showTime
            format="YYYY-MM-DD"
            :placeholder="$t('languages.Apps.EndTime')"
            v-model="backData.endValue"
            :disabledDate="disabledEndDate"
            :open="endOpen"
            :getCalendarContainer="getPopupContainer"
            @openChange="handleEndOpenChange"
          />
        </div>
        <!-- <a-range-picker
            class="date"
            @change="dateChange"
            :placeholder="['开始时间','结束时间']"
            v-if="backData.startValue"
            v-model="defaultValue"
            :getCalendarContainer="getPopupContainer"
          />
          <a-range-picker
            :getCalendarContainer="getPopupContainer"
            v-else
            class="date"
            @change="dateChange"
            :placeholder="['开始时间','结束时间']"

          /> -->
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.Visible') }}</label>
      </a-col>
      <a-col :span="19">
        <a-switch v-model="backData.visible"/>
      </a-col>
    </a-row>
    <div class="btn-group btn-group-fixed clearfix">
      <a-button
        class="btn"
        type="primary"
        size="small"
        @click="close"
      >{{ $t('languages.Apps.Ok') }}</a-button>
      <a-button
        class="btn"
        size="small"
        @click="cancel"
      >{{ $t('languages.Apps.Cancel') }}</a-button>
    </div>
    <div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Emit
} from 'vue-property-decorator';
import moment from 'moment';
import { DateDefaultType } from '../../control-modals-map';
@Component({
  name: 'Date',
})
export default class Date extends Vue {
  @Prop() modalData !: any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  dateFormat:string = 'YYYY/MM/DD';

  visible: boolean = true;

  DateDefaultType = DateDefaultType;

  endOpen: boolean = false;

  backData = {
    choiceType: '',
    defaultValue: '',
    displayType: 4,
    startValue: null,
    endValue: null,
    name: '',
    options: '',
    propertyCode: '',
    propertyType: '',
    userOptionType: '',
    visible: true,
    propertyName: '',
    dateType: 0
  }

  created() {
    this.backData = this.modalData.data;
    const { startValue, endValue, dateType } = this.modalData.data;
    this.backData.startValue = startValue || null;
    this.backData.endValue = endValue || null;
    this.backData.dateType = dateType || 0;

    this.setDefaultValue(this.backData.startValue, this.backData.endValue);
  }

  /**
   * 设置默认值
   */
  setDefaultValue(start:any, end:any) {
    this.backData.startValue = start ? moment(start, this.dateFormat) : start;
    this.backData.endValue = end ? moment(end, this.dateFormat) : end;
  }

  cancel() {
    this.$emit('closeModal');
  }

  close() {
    if (this.backData.name === '') {
      return;
    }
    const backData = { ...this.backData };
    const { startValue, endValue }: any = this.backData;
    backData.startValue = (startValue ? startValue.format('YYYY-MM-DD') : '') as any;
    backData.endValue = (endValue ? endValue.format('YYYY-MM-DD') : '') as any;
    this.$emit('backData', backData);
  }

  closeModal() {
    this.$emit('cancel');
  }

  /**
   * 时间处理
   */
  disabledStartDate(startValue:any) {
    const { endValue } = this.backData;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > (endValue as any).valueOf();
  }

  disabledEndDate(endValue:any) {
    const { startValue } = this.backData;
    if (!endValue || !startValue) {
      return false;
    }
    return (startValue as any).valueOf() >= endValue.valueOf();
  }

  handleStartOpenChange(open:any) {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open:any) {
    this.endOpen = open;
  }
}
</script>
<style lang="less" scoped>
  .popover-wrap{
    padding: 0 6px;
    width: 358px;
    overflow: visible;
    .row{
      margin-bottom: 16px;
      .ant-col-5{
        label{
          line-height: 32px;
          color: rgba(0, 0, 0, .65);
        }
      }
      .ant-col-19{
        .l-h{
          line-height: 32px;
        }
        .date{
          width: 110px;
          margin-right: 8px;
        }
        .select-wrap{
          position: relative;
          width: 100%;
          .select{
            width: 100%;
          }
        }
      }
    }
    .btn-group {
      .btn{
        &:last-child{
          margin-right: 8px;
        }
        float: right;
      }
      .left{
        margin-right: 16px;
      }
    }
    .empty-tip{
      color: #f5222d;
      font-size: 12px;
    }
    input.input-error{
      border-color:#f5222d;
    }
  };
</style>
