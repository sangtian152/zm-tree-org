<template>
  <div id="vue-admin-beautiful">
    <zm-tree-org 
      :data="data"      
      :horizontal="horizontal"      
      :collapsable="collapsable"
      :label-style="style"
      :props="{label: 'name'}"
      @on-expand="onExpand"
      @on-node-click="onNodeClick"
    ></zm-tree-org>
  </div>
</template>

<script>
  import { data } from "./data"
export default {
  name: "App",
  data(){
        return {
          data: data,
          horizontal: false,
          collapsable: true,
          expandAll: true,
          style: {
            background:'#012252',
            color:'#fff'
          }     
        } 
      },
      created(){
          this.toggleExpand(this.data, this.expandAll);
      }, 
      mounted() {},
      methods:{
          onExpand(e, data) {
            console.log(e, data)
          },
          onNodeClick(e, data) {
            this.$log.info(data.label)
          },
          collapse(list) {
            console.log(list)
          },
          expandChange() {
            this.toggleExpand(this.data, this.expandAll);
          },
          toggleExpand(data, val) {
            if (Array.isArray(data)) {
              data.forEach(item => {
                this.$set(item, "expand", val);
                if (item.children) {
                  this.toggleExpand(item.children, val);
                }
              });
            } else {
              this.$set(data, "expand", val);
              if (data.children) {
                this.toggleExpand(data.children, val);
              }
            }
          }
      }  
};
</script>
<style>
  html, body{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #vue-admin-beautiful {
    height: 100%;
  }
</style>
