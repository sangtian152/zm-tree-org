<template>
  <div id="clone-tree-org" class="clone-tree-org tree-org">
    <tree-org-node
      :data="data"
      :props="props"
      :horizontal="horizontal"
      :label-style="labelStyle"
      :collapsable="collapsable"
      :render-content="renderContent"
      :label-class-name="labelClassName"
      @on-node-click="(e, data) => { $emit('on-node-click', e, data)}"
      @on-node-mouseenter="(e, data) => $emit('on-node-mouseenter', e, data)"
      @on-node-mouseleave="(e, data) => $emit('on-node-mouseleave', e, data)"
    />
  </div>
</template>
<script>
  import render from '@/components/tree-org/node';
  export default {
    components: {
      TreeOrgNode: {
        render,
        functional: true
      }
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      props: {
        type: Object,
        default: () => ({
          label: 'label',
          expand: 'expand',
          children: 'children'
        })
      },
      horizontal: Boolean,
      selectedKey: String,
      collapsable: Boolean,
      renderContent: Function,
      labelStyle: Object,
      labelClassName: [Function, String],
      selectedClassName: [Function, String]
    },
    data(){
      return {
        init:false,
      }
    },
    mounted(){
      if(this.init){
        document.body.appendChild(this.$el);
      }
      this.init = true;
    },
  }
</script>
<style lang="scss" scoped>
  .clone-tree-org{
    opacity: 0;
    position: fixed;
    top:0;
    left:0;
    z-index:1000;
  }
</style>