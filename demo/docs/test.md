## Demo 演示案例

### 基础用法

可以设置类似的data数据格式来生成树形组织图，并可以通过style精确配置每个节点的样式或className精确配置每个节点的class名

::: demo
```html
<template>
    <div>
      <div style="display: flex; padding: 10px 0;">
        <div style="margin-right: 10px"><i-switch v-model="horizontal"></i-switch> 是否是横向</div>
        <div style="margin-right: 10px"><i-switch v-model="collapsable"></i-switch> 可展开收起</div>
        <div style="margin-right: 10px"><i-switch v-model="expandAll" @on-change="expandChange"></i-switch> 展开全部</div>
        <div>
          背景色：
          <color-picker v-model="style.background" size="small"></color-picker>&nbsp;
          文字颜色：
          <color-picker v-model="style.color" size="small"></color-picker>&nbsp;
        </div>
    </div>
    <div style="height: 400px; border:1px solid #eee">
      <zm-tree-org
        :data="data"
        :horizontal="horizontal"      
        :collapsable="collapsable"
        :label-style="style"
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
            id: 0,
            label: "xxx科技有限公司",
            children: [
              {
                id: 2,
                label: "产品研发部",
                style: { color:'#fff', background:'#108ffe' },
                children: [
                  {
                    id: 5,
                    label: "研发-前端"
                  },
                  {
                    id: 6,
                    label: "研发-后端"
                  },
                  {
                    id: 9,
                    label: "UI设计"
                  },
                  {
                    id: 10,
                    label: "产品经理"
                  },
                  {
                    id: 10,
                    label: "测试"
                  }
                ]
              },
              {
                id: 3,
                label: "客服部",
                children: [
                  {
                    id: 7,
                    label: "客服一部"
                  },
                  {
                    id: 8,
                    label: "客服二部"
                  }
                ]
              },
              {
                id: 4,
                label: "业务部"
              },
              {
                id: 9,
                label: "人力资源中心"
              }
            ]
          },
          horizontal: false,
          collapsable: true,
          expandAll: true,
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
          onNodeClick(e, data) {
            this.$message(data.label)
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
| renderContent     | 渲染函数   | Function  |  —   |   —   |
| labelStyle     | 自定义label标签的样式   | Object  |  —   |   —    |
| labelClassName     | 自定义label节点的样式名   | [Function, String]  |  —   |   —   |
| selectedClassName  | 自定义选择节点的样式名   | [Function, String]  |  —   |   —   |

### Events

| 事件名      | 说明    | 返回值      |
|---------- |-------- |---------- |
| on-expand | 节点展开事件，注意，展开节点时如监听了label点击事件，则需要阻止冒泡 e.stopPropagation()  | e, data  |
| on-node-click | 节点点击事件  | e, data  |
| on-zoom | 缩放事件  | scale缩放倍数  |
| on-drag | 拖拽事件  | x, y  |
| on-drag-stop | 拖拽结束事件  | x, y  |

