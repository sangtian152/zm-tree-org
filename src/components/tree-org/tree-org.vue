<template>
  <div ref="zm-tree-org" class="zm-tree-org">
    <div
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
        <div ref="tree-org" class="tree-org" :class="{horizontal, collapsable}">
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
      </vue-draggable-resizable>
    </div>
    <template v-if="tools">
      <div class="zm-tree-handle">
        <div v-if="tools.scale" class="zm-tree-percent">{{zoomPercent}}</div>
        <div v-if="tools.expand" @click="expandChange" :title="expandTitle" class="zm-tree-handle-item">
          <span class="zm-tree-svg">
            <img src="@/svg/expand.svg" alt="">
          </span>
        </div>
        <div v-if="tools.zoom" @click="enlargeOrgchart" title="放大" class="zm-tree-handle-item zoom-out">
          <span class="zm-tree-icon">+</span>
        </div>
        <div v-if="tools.zoom" @click="narrowOrgchart" title="缩小" class="zm-tree-handle-item zoom-in">
          <span class="zm-tree-icon">-</span>
        </div>
        <div v-if="tools.restore" @click="restoreOrgchart" title="还原" class="zm-tree-handle-item">
          <span class="zm-tree-restore"></span>
        </div>
        <div v-if="tools.fullscreen" @click="handleFullscreen" :title="fullTiltle" class="zm-tree-handle-item">
          <span class="zm-tree-svg">
            <img src="@/svg/fullscreen.svg" alt="">
          </span>
        </div>
      </div>
    </template>
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
      toolBar:{
        type:[Object, Boolean],
        default: ()=>({
          expand: true,
          scale: true,
          zoom: true,
          restore: true,
          fullscreen: true,
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
        tools:{
          expand: true,
          scale: true,
          zoom: true,
          restore: true,
          fullscreen: true,
        },
        autoDragging: false,
        scale: 1,
        left: 0,
        top: 0,
        expanded: false,
        fullscreen: false,
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
      zoomPercent(){
        return `${Math.round(this.scale * 100)}%`
      },
      expandTitle(){
        return this.expanded ? "收起全部节点" : "展开全部节点";
      },
      fullTiltle(){
        return this.fullscreen ? "退出全屏" : "全屏";
      }
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
      if(typeof this.toolBar === 'object') {
        Object.assign(this.tools, this.toolBar);
      } else if(!this.toolBar){
        this.tools = false;
      }
    },
    methods:{
      onDrag(x, y) {
        this.dragging = true;
        this.autoDragging = false;
        this.left = x;
        this.top = y;
        this.$emit('on-drag', {x, y})
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
        this.$emit('on-drag-stop', {x, y})
      },
      zoomWheel(e) {
        e.preventDefault();
        // 鼠标滚轮缩放
        if (e.deltaY > 0) {
          this.narrowOrgchart();
        } else {
          this.enlargeOrgchart();
        }
        this.$emit('on-zoom', this.scale)
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
      restoreOrgchart(){
        this.scale = 1;
        this.left = 0;
        this.top = 0;
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
      handleFullscreen(){
        this.fullscreen = !this.fullscreen;
        if(this.fullscreen) {
          this.launchIntoFullscreen();
        } else {
          this.exitFullscreen();
        }
      },
      launchIntoFullscreen() {
        // 全屏
        const element = this.$refs['zm-tree-org']
        if(element.requestFullscreen){
            element.requestFullscreen();
        }
        else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
      },
      exitFullscreen() {
        // 退出全屏
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
      },
      collapse(list) {
        list.forEach(child => {
          if (child.expand) {
            child.expand = false;
          }
          child.children && this.collapse(child.children);
        });
      },
      expandChange() {
        this.expanded = !this.expanded
        this.toggleExpand(this.data, this.expanded);
        if(!this.expanded){
          this.$nextTick(() => {
            this.onDragStop(this.left, this.top);
          });
        }
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
<style lang="scss" scoped>
.zm-tree-org {
  background: #fff;
  .vdr {
    touch-action: none;
    border: none;
    &:not(.dragging) {
      transition: all 0.1s;
    }
    ::v-deep {
      .handle {
        display: none!important;
      }
    }
  }
}
</style>