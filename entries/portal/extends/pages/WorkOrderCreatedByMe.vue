<template>
  <work-order-tree/>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import WorkOrderTree from "../components/WorkOrderTree";

@Component({
  name: 'WorkOrderCreatedByMe',
  components: {WorkOrderTree}
})
export default class WorkOrderCreatedByMe extends Vue {
  name: "WorkOrderCreatedByMe"
}
</script>

<style scoped>

</style>
