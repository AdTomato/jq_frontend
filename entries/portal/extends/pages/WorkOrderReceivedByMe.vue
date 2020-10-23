<template>
  <work-order-tree workOrderType="receive"/>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import WorkOrderTree from "../components/WorkOrderTree";

@Component({
  name: 'WorkOrderReceivedByMe',
  components: {WorkOrderTree}
})
export default class WorkOrderReceivedByMe extends Vue {
  name: "WorkOrderReceivedByMe"
}
</script>

<style scoped>

</style>
