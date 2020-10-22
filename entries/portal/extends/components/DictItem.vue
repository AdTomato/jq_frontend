<template>
  <div>
    <a-tag v-if="tag" :color="tagColor">
      {{ showValue }}
    </a-tag>
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
   * 计算属性 显示值
   */
  get showValue() {
    if (this.data) {
      return this.data[this.value].name
    }
    return this.value
  }

  /**
   * 计算属性 标签颜色
   */
  get tagColor() {
    if (this.tag && this.data) {
      return this.color || this.data[this.value].color
    }
    return '';
  }

}
</script>

<style lang="less" scoped>

</style>
