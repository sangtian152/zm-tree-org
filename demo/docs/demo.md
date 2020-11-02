## Demo 演示案例

### 基础用法

可以设置类似的data数据格式来生成树形组织图，并可以通过style精确配置每个节点的样式或className精确配置每个节点的class名

::: demo
```html
<template>
    <div>
      <div style="display: flex; padding: 10px 0;">
        <div style="margin-right: 10px"><i-switch v-model="horizontal"></i-switch> 横向</div>
        <div style="margin-right: 10px"><i-switch v-model="collapsable"></i-switch> 可收起</div>
        <div style="margin-right: 10px"><i-switch v-model="disaled"></i-switch> 禁止编辑</div>
        <div style="margin-right: 10px"><i-switch v-model="onlyOneNode"></i-switch> 仅拖动当前节点</div>
        <div style="margin-right: 10px"><i-switch v-model="cloneNodeDrag"></i-switch> 拖动节点副本</div>
    </div>
    <div>
      背景色：
      <color-picker v-model="style.background" size="small"></color-picker>&nbsp;
      文字颜色：
      <color-picker v-model="style.color" size="small"></color-picker>&nbsp;
    </div>
    <div style="height: 400px; border:1px solid #eee">
      <zm-tree-org
        :data="data"
        :horizontal="horizontal"      
        :collapsable="collapsable"
        :label-style="style"
        :node-draggable="true"
        :disabled="disaled"
        :only-one-node="onlyOneNode"
        :clone-node-drag="cloneNodeDrag"
        :node-draging="nodeDragMove"
        :node-drag-end="nodeDragEnd"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"
      ></zm-tree-org>
    </div>
  </div>
</template>
<script>
    export default {
      data(){
        return {
          data: {
            id: 1,
            label: "xxx科技有限公司",
            children: [
              {
                id: 2,
                pid: 1,
                label: "产品研发部",
                style: { color:'#fff', background:'#108ffe' },
                children: [
                  {
                    id: 6,
                    pid: 2,
                    label: "禁止编辑节点",
                    disabled: true,
                  },
                  {
                    id: 7,
                    pid: 2,
                    label: "研发-后端"
                  },
                  {
                    id: 8,
                    pid: 2,
                    label: "禁止拖拽节点",
                    noDragging: true
                  },
                  {
                    id: 9,
                    pid: 2,
                    label: "产品经理"
                  },
                  {
                    id: 10,
                    pid: 2,
                    label: "测试"
                  }
                ]
              },
              {
                id: 3,
                pid: 1,
                label: "客服部",
                children: [
                  {
                    id: 11,
                    pid: 3,
                    label: "客服一部"
                  },
                  {
                    id: 12,
                    pid: 3,
                    label: "客服二部"
                  }
                ]
              },
              {
                id: 4,
                pid: 1,
                label: "业务部"
              },
              {
                id: 5,
                pid: 1,
                label: "人力资源中心"
              }
            ]
          },
          horizontal: false,
          collapsable: true,
          onlyOneNode: true,
          cloneNodeDrag: true,
          expandAll: true,
          disaled: false,
          style: {
            background:'#fff',
            color:'#5e6d82'
          }     
        } 
      },
      created(){
          this.toggleExpand(this.data, this.expandAll);
      }, 
      methods:{
          onExpand(e, data) {
            console.log(e, data)
          },
          nodeDragMove(data){
            console.log(data)
          },
          nodeDragEnd(data, isSelf){
            console.log(data, isSelf)
            isSelf && this.$Message.info("移动到自身")
          },
          onNodeClick(e, data) {
            this.$Message.info(data.label)
          },
          handleNodeAdd(node){
            console.log(node)
            this.$Message.info("新增节点")
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
    }
</script>
```
:::

### Attributes

| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| data     | 数据源,必须传入   | []  |  —   |   —   |
| props    | 结构map参考   | Object  |  —   |  {label: 'label', expand: 'expand',children: 'children'  }  |
| toolBar    | 工具栏   | [Object, Boolean] |  —   |  {scale: true, restore: true, expand: true, zoom: true, fullscreen: true,  }  |
| horizontal     | 是否是横向   | Boolean  | true,false  |  false  |
| collapsable     | 是否可以展开收起节点   | Boolean  | true,false  |  false  |
| disabled     | 禁止编辑，设为true后，所有节点不可新增下级、编辑和删除，单个节点禁止编辑，可将节点属性设置disabled为true   | Boolean  | true,false  |  true  |
| draggable     | 架构图是否可拖拽，单个节点禁止拖拽，可将节点属性设置noDragging为true   | Boolean  | true,false  |  true  |
| draggableOnNode     | 架构图拖拽在节点触发，nodeDraggable值为false时，设为true才有效  | Boolean  | true,false  |  false  |
| nodeDraggable     | 节点是否可拖拽   | Boolean  | true,false  |  true  |
| cloneNodeDrag     | 是否拷贝节点拖拽   | Boolean  | true,false  |  true  |
| onlyOneNode     | 是否仅拖动当前节点，如果true，仅拖动当前节点，子节点自动添加到当前节点父节点，如果false，则当前节点及子节点一起拖动   | Boolean  | true,false  |  true  |
| renderContent     | 渲染函数   | Function  |  —   |   —   |
| labelStyle     | 自定义label标签的样式   | Object  |  —   |   —    |
| labelClassName     | 自定义label节点的样式名   | [Function, String]  |  —   |   —   |
| selectedClassName  | 自定义选择节点的样式名   | [Function, String]  |  —   |   —   |
| node-add  | 自定义节点新增，覆盖默认新增行为（参数当前节点node）  | Function   |  —   |   —   |
| node-delete  | 自定义节点删除，覆盖默认新增行为（参数当前节点node） | Function   |  —   |   —   |
| node-edit  | 自定义节点编辑，覆盖默认新增行为（参数当前节点node） | Function   |  —   |   —   |

### Events

| 事件名      | 说明    | 返回值      |
|---------- |-------- |---------- |
| on-expand | 节点展开事件，注意，展开节点时如监听了label点击事件，则需要阻止冒泡 e.stopPropagation()  | e, data  |
| on-node-click | 节点点击事件  | e, data  |
| on-node-focus | 节点获取焦点事件  | e, data  |
| on-node-blur | 节点失去焦点事件  | e, data  |
| on-zoom | 缩放事件  | scale缩放倍数  |
| on-drag | 拖拽事件  | x, y  |
| on-drag-stop | 拖拽结束事件  | x, y  |
