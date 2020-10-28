<template>
  <div>
    <a-tag v-if="tag" :color="tagColor">
      {{ showValue }}
    </a-tag>
    <div v-else-if="avatar" class="user-info">
      <span v-if="imgUrl" class="avatar">
        <img :src="imgUrl" alt="用户头像">
      </span>
      <span>{{ showValue }}</span>
    </div>
    <span v-else>{{ showValue }}</span>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {DictData} from "../types/data";

@Component({
  name: 'DictItem',
})
export default class DictItem extends Vue {

  /**
   * 实际值
   */
  @Prop({
    type: [String, Number]
  })
  value!: string | number;

  /**
   * 是否显示标签
   */
  @Prop({
    type: Boolean,
    default: false
  })
  tag?: boolean;

  /**
   * 标签颜色
   */
  @Prop({
    type: String,
    default: ''
  })
  color?: string;

  /**
   * 数据字典
   */
  @Prop(
    {
      type: Object,
    }
  )
  data: DictData

  /**
   * 针对用户字典，是否使用头像
   */
  @Prop(
    {
      type: Boolean,
      default: false
    }
  )
  avatar?: boolean

  /**
   * 计算属性 显示值
   */
  get showValue() {
    if (this.data && this.data[this.value] && this.data[this.value].name) {
      return this.data[this.value].name
    }
    return this.value
  }

  /**
   * 计算属性 标签颜色
   */
  get tagColor() {
    if (!this.tag) return '';

    if (this.color) {
      return this.color
    } else if (this.data && this.data[this.value] && this.data[this.value].color) {
      return this.data[this.value].color
    }

  }


  /**
   * 计算属性，图片地址
   */
  get imgUrl() {
    if (this.avatar) {
      if (this.data && this.data[this.value] && this.data[this.value].link) {
        return this.data[this.value].link
      }
      return 'data:image/png;base64,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'
    }
    return '';
  }
}
</script>

<style lang="less" scoped>
.user-info {
  display: inline-flex;
  align-items: center;
  //background: #ECEFF2;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 72px;
  min-height: 32px;
  vertical-align: top;
  margin-bottom: 3px;

  .avatar {
    width: 24px;
    height: 24px;
    margin-right: 6px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

  }
}
</style>
