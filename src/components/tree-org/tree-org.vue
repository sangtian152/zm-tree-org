<template>
  <div class="draggable-wrap">
    <div
      id="pdfDom"
      ref="zoom"
      class="zoom-container"
      :style="zoomStyle"
      @wheel="zoomWheel"
    >
      <vue-draggable-resizable
        w="auto"
        h="auto"
        :x="left"
        :y="top"
        :class="{ dragging: autoDragging }"
        @dragging="onDrag"
        @dragstop="onDragStop"
      >
        <div ref="tree-org" class="tree-org-container">
          <div class="tree-org" :class="{horizontal, collapsable}">
            <tree-org-node
              :data="data"
              :props="keys"
              :horizontal="horizontal"
              :label-style="labelStyle"
              :collapsable="collapsable"
              :render-content="renderContent"
              :label-class-name="labelClassName"
              @on-expand="handleExpand"
              @on-node-click="(e, data) => { $emit('on-node-click', e, data)}"
            />
          </div>
        </div>
      </vue-draggable-resizable>
    </div>
  </div>
</template>

<script>
  import render from './node'
  export default {
    name: 'ZmTreeOrg',
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
        treeData:{},
        keys:{
          label: 'label',
          expand: 'expand',
          children: 'children'
        },
        autoDragging: false,
        scale: 1,
        left: 100,
        top: 0,
      }
    },
    computed:{
      zoomStyle() {
        const { scale } = this;
        return {
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          transform: `scale(${scale})`,
        };
      },
    },
    watch:{
      horizontal(){
        // 改变架构图方向时，防止溢出边界
        this.$nextTick(() => {
          this.onDragStop(this.left, this.top);
        });
      }
    },
    created(){
      Object.assign(this.keys, this.props);
    },
    methods:{
      onDrag(x, y) {
        this.dragging = true;
        this.autoDragging = false;
        this.left = x;
        this.top = y;
      },
      onDragStop(x, y) {
        // 防止拖拽出边界
        this.dragging = false;
        const zoom = this.$refs.zoom;
        const orgchart = this.$refs["tree-org"];
        const maxX = zoom.clientWidth / 2;
        const maxY = zoom.clientHeight / 2;
        let minY = zoom.clientHeight - orgchart.clientHeight;
        let minX = zoom.clientWidth - orgchart.clientWidth;
        if (minY > 0) {
          minY = 0;
        }
        if (minX > 0) {
          minX = 0;
        }
        if (x > maxX) {
          this.left = maxX;
        } else if (x < minX) {
          this.left = minX;
        } else {
          this.left = x;
        }
        if (y < minY) {
          this.top = minY;
        } else if (y > maxY) {
          this.top = maxY;
        } else {
          this.top = y;
        }
      },
      zoomWheel(e) {
        // 鼠标滚轮缩放
        if (e.deltaY > 0) {
          this.narrowOrgchart();
        } else {
          this.enlargeOrgchart();
        }
      },
      enlargeOrgchart() {
        // 鼠标滚轮向上滚动放大
        if (Number(this.scale) < 3) {
          let scale = Number(this.scale) + 0.1;
          this.scale = Number(scale).toFixed(1);
        }
      },
      narrowOrgchart() {
        // 鼠标滚轮向下滚动缩小
        if (Number(this.scale) > 0.3) {
          let scale = Number(this.scale) - 0.1;
          this.scale = Number(scale).toFixed(1);
        }
      },
      autoDrag(el, left, top) {
        // 计算偏移量，保持根节点相对页面位置不变
        this.autoDragging = true;
        this.dragging = false;
        const x = el.offsetLeft - left;
        const y = el.offsetTop - top;
        this.left -= x;
        this.top -= y;
      },
      handleExpand(e, data) {
        e.stopPropagation();
        const el = document.querySelector(".root-tree-org-node-label");
        const left = el.offsetLeft;
        const top = el.offsetTop;
        if ("expand" in data) {
          data.expand = !data.expand;
          if (!data.expand && data.children) {
            this.collapse(data.children);
          }
        } else {
          this.$set(data, "expand", true);
        }
        this.$nextTick(() => {
          this.autoDrag(el, left, top);
        });
        this.$emit('on-expand', e, data)
      },
      collapse(list) {
        list.forEach(child => {
          if (child.expand) {
            child.expand = false;
          }
          child.children && this.collapse(child.children);
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
.draggable-wrap {
  height: 100%;
  .zoom-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    transform-origin: left top;
  }
  .vdr {
    touch-action: none;
    border: none;

    &:not(.dragging) {
      transition: all 0.1s;
    }
  }
  .tree-org {
    & > .tree-org-node {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &.horizontal > .tree-org-node {
      flex-direction: row;
    }
  }
}
</style>