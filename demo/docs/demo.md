## Demo 演示案例

### 基础用法

可以设置类似的data数据格式来生成树形组织图，并可以通过style精确配置每个节点的样式或className精确配置每个节点的class名
```
注：
1.如果需要拖动节点，或新增、编辑和删除节点功能，则节点必须有id（节点唯一标识）和pid（父级节点唯一标识）属性
或者通过props指定id和pid属性
2.由于节点拖拽功能阻止了节点文本选中，所以，在右键菜单中提供了复制节点文本功能。
```
<br />

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
    <div style="padding-bottom:10px">
      背景色：
      <color-picker v-model="style.background" size="small"></color-picker>&nbsp;
      文字颜色：
      <color-picker v-model="style.color" size="small"></color-picker>&nbsp;
      搜索：
      <input type="text" v-model="keyword" placeholder="请输入搜索内容" @keydown.enter="filter" />
    </div>
    <div style="height: 400px; border:1px solid #eee">
      <zm-tree-org
        ref="tree"
        :data="data"
        :disabled="disaled"
        :horizontal="horizontal"      
        :collapsable="collapsable"
        :label-style="style"
        :node-draggable="true"
        :default-expand-level="1"
        :only-one-node="onlyOneNode"
        :clone-node-drag="cloneNodeDrag"
        :node-draging="nodeDragMove"
        :before-drag-end="beforeDragEnd"
        :node-drag-end="nodeDragEnd"
        :toolBar="toolBar"
        :filterNodeMethod="filterNodeMethod"
        @on-contextmenu="onMenus"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"
        @on-node-dblclick="onNodeDblclick"
        @on-node-copy="onNodeCopy"
      >
        <!-- <template v-slot="{node}">
            <div class="tree-org-node__text node-label">{{node.label}}</div>
        </template>
        <template v-slot:expand="{node}">
          <div>{{node.children.length}}</div>
        </template> -->
      </zm-tree-org>
    </div>
  </div>
</template>
<script>
    export default {
      data(){
        return {
          toolBar: {
            scale: false
          },
          keyword: '',
          data: {
            id: 1,
            label: "xxx科技有限公司",
            children: [
              {
                id: 2,
                pid: 1,
                label: "产品研发部",
                style: { color:'#fff', background:'#108ffe' },
                expand: false,
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
          // this.toggleExpand(this.data, this.expandAll);
      }, 
      methods:{
        onMenus({node, command}) {
          console.log(node, command)
        },
        filter(){
          this.$refs.tree.filter(this.keyword)
        },
        filterNodeMethod(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
          onExpand(e, data) {
            console.log(e, data)
          },
          nodeDragMove(data){
            console.log(data)
          },
          beforeDragEnd(node, targetNode) {
            return new Promise((resolve, reject) => {
              if (!targetNode) reject();
              if (node.id === targetNode.id) {
                reject()
              } else {
                resolve()
              }
            })
          },
          nodeDragEnd(data, isSelf){
            console.log(data, isSelf)
            isSelf && this.$Message.info("移动到自身")
          },
          onNodeClick(e, data) {
            this.$Message.info(data.label)
          },
          onNodeDblclick(){
            this.$Message.info("双击节点")
          },
          onNodeCopy(){
            this.$Message.success("复制成功")
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
| data     | 数据源,必须传入   | Object  |  —   |   —   |
| props    | 结构map参考   | Object  |  —   |  {id: 'id', pid: 'pid', label: 'label', expand: 'expand',children: 'children'  }  |
| tool-bar    | 工具栏   | [Object, Boolean] |  —   |  {scale: true, restore: true, expand: true, zoom: true, fullscreen: true,  }  |
| horizontal     | 是否是横向   | Boolean  | true,false  |  false  |
| collapsable     | 是否可以展开收起节点   | Boolean  | true,false  |  false  |
| filter-node-method | 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏 | Function(value, data) | —— | —— |
| default-expand-level     | 默认展开层级（如果层级内有节点展开属性值为false，该节点不会默认展开）   | Number  | ——  |  ——  |
| disabled     | 禁止编辑，设为true后，所有节点不可新增下级、编辑和删除，单个节点禁止编辑，可将节点属性设置disabled为true   | Boolean  | true,false  |  true  |
| draggable     | 架构图是否可拖拽，单个节点禁止拖拽，可将节点属性设置noDragging为true   | Boolean  | true,false  |  true  |
| scalable     | 架构图是否可缩放   | Boolean  | true,false  |  true  |
| draggable-on-node     | 架构图拖拽在节点触发，node-draggable值为false时，设为true才有效  | Boolean  | true,false  |  false  |
| node-draggable     | 节点是否可拖拽   | Boolean  | true,false  |  true  |
| clone-node-drag     | 是否拷贝节点拖拽   | Boolean  | true,false  |  true  |
| only-one-node     | 是否仅拖动当前节点，如果true，仅拖动当前节点，子节点自动添加到当前节点父节点，如果false，则当前节点及子节点一起拖动   | Boolean  | true,false  |  true  |
| node-drag-start  | 节点拖拽开始（参数当前节点node）  | Function   |  —   |   —   |
| node-draging  | 节点拖拽（参数当前节点node）  | Function   |  —   |   —   |
| before-drag-end  | 节点拖拽结束前钩子（参数当前节点node, 目标节点targetNode），若返回 false 或者返回 Promise 且被 reject，则阻止节点拖拽  | Function   |  —   |   —   |
| node-drag-end  | 节点拖拽结束后（参数当前节点node, 判断当前节点和目标节点是否同一节点isSelf）  | Function   |  —   |   —   |
| node-add  | 自定义节点新增，覆盖默认新增行为（参数当前节点node）  | Function   |  —   |   —   |
| node-delete  | 自定义节点删除，覆盖默认新增行为（参数当前节点node，父级节点parentNode） | Function   |  —   |   —   |
| node-edit  | 自定义节点编辑，覆盖默认新增行为（参数当前节点node） | Function   |  —   |   —   |
| node-copy  | 复制节点文本，覆盖默认复制节点文本行为（参数当前节点node） | Function   |  —   |   —   |
| define-menus  | 自定义右键菜单，接受包含name和command属性的对象数组，或者一个返回值为包含name和command属性的对象数组的函数（参数MouseEvent和node） | Array, Function   |  [{ name: '复制文本', command: 'copy' },{ name: '新增节点', command: 'add' },{ name: '编辑节点', command: 'edit' },{ name: '删除节点', command: 'delete' }]  |   —   |
| render-content     | 渲染函数   | Function  |  —   |   —   |
| label-style     | 自定义label标签的样式   | Object  |  —   |   —    |
| label-class-name     | 自定义label节点的样式名   | [Function, String]  |  —   |   —   |
| click-delay  | 单机事件延迟（毫秒），解决双击鼠标时同时触发单击事件问题   | Number  |  —   |   260   |

```
注：
1.如果需要拖动节点，或新增、编辑和删除节点功能，则节点必须有id（节点唯一标识）和pid（父级节点唯一标识）属性
或者通过props指定id和pid属性
2.由于节点拖拽功能阻止了节点文本选中，所以，在右键菜单中提供了复制节点文本功能。
```

### Events

| 事件名      | 说明    | 返回值      |
|---------- |-------- |---------- |
| on-expand | 节点展开事件，注意，展开节点时如监听了label点击事件，则需要阻止冒泡 e.stopPropagation()  | e, data  |
| on-node-click | 节点点击事件  | e, data  |
| on-node-dblclick | 节点双击事件  | e, data  |
| on-node-focus | 节点获取焦点事件  | e, data  |
| on-node-blur | 节点失去焦点事件  | e, data  |
| on-node-copy | 复制节点文本事件，如果设置了node-copy属性，此事件将不会执行  | 复制的文本  |
| on-node-delete | 删除节点事件，如果设置了node-delete属性，此事件将不会执行  | 删除的节点node，父级节点parentNode  |
| on-contextmenu | 右键菜单点击事件  | {command, node}  |
| on-zoom | 缩放事件  | scale缩放倍数  |
| on-drag | 拖拽事件  | x, y  |
| on-drag-stop | 拖拽结束事件  | x, y  |

### Methods

| 事件名      | 说明    | 返回值      |
|---------- |-------- |---------- |
| filter | 对树节点进行筛选操作  | 接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数  |

### Slot

| name      | 说明    |
|---------- |-------- |
| — | 自定义节点内容，参数为 { node }  |
| expand | 自定义节点展开按钮内容，参数为 { node }  |