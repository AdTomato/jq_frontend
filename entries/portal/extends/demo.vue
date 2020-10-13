<template>
  <div>{{ userInfo }}</div>
</template>

<script lang="ts">
import OAuthApi from "@/apis/oauth";
import {Component, Vue} from "vue-property-decorator";

@Component({
  name: 'demo',
})
export default class Demo extends Vue {

  /* 用户信息 */
  userInfo: any = {};

  created() {
    this.getUserInfo();
  }

  /* 获取当前用户信息 */
  async getUserInfo() {
    const res = await OAuthApi.getUserInfo();
    if (res.errcode === 0) {
      this.userInfo = res.data;
      console.log('用户信息 => ',this.userInfo)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
