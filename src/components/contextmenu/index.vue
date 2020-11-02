<template>
	<transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
		<div
			v-show="visible"
			:style="position"
			@click="handleMenu"
			class="zm-tree-contextmenu">
			<ul>
				<li class="zm-tree-menu-item" action="copy">复制文本</li>
				<template v-if="editable">
					<li class="zm-tree-menu-item" action="add">新增节点</li>
					<li class="zm-tree-menu-item" action="edit">编辑节点</li>
					<li class="zm-tree-menu-item" action="delete">删除节点</li>
				</template>
			</ul>
			<textarea class="copy-textarea" ref="copy" v-model="copyText"></textarea>
		</div>
</transition>
</template>
<script>
	export default {
		name: "ZmContextmenu",
		props:{
			visible:{
				type: Boolean,
				required: true,
			},
			data: {
        type: Object,
        required: true
      },
      node: {
        type: Object,
        required: true
      },
      props: {
        type: Object,
        default: () => ({
          id: "id",
          pid: "pid",
          label: 'label',
          expand: 'expand',
          children: 'children'
        })
      },
      x: Number,
      y: Number,
      nodeAdd: Function,
      nodeDelete: Function,
      nodeEdit: Function,
      nodeCopy: Function,
      disabled: Boolean,
		},
		data(){
      return {
        init:false,
        copyText: "",
        oldData:{},
      }
    },
    computed:{
			position() {
				return {
					left: `${this.x}px`,
					top: `${this.y}px`,
				}
			},
			editable(){
				return !this.disabled && !this.node.disabled;
			}
		},
		mounted(){
      if(!this.init){
        document.body.appendChild(this.$el);
        document.addEventListener('mousedown', this.handleClose);
      }
      this.init = true;
    },
    destroyed(){
			document.removeEventListener('mousedown', this.handleClose);
    },
		methods:{
			//递归遍历实现
			getNodeById(data, key, value){
				if (data[key] === value) {
					return data;
				} else if (Array.isArray(data.children)) {
					let list = data.children;
					for (let i = 0, len = list.length; i < len; i++){
						let row = list[i];
						let pNode = this.getNodeById(row, key, value);
						if (pNode) {
								return pNode;
						}
					}
				}
			},
			//移除节点
			handleDelete(){
				const { props, data, node } = this;
				if (this.nodeDelete) {
					this.nodeDelete(node)
					return
				}
				if(node.root){
					this.$log.pretty('[提示] ', '根节点不允许删除', 'danger')
					return
				}
				const { id, pid, children } = props;
				const oldPaNode = this.getNodeById(data, id, node[pid]);
				const list = oldPaNode[children];
				for(let i = 0, len = list.length; i < len; i ++){
					if(list[i][id] === node[id]) {
						list.splice(i, 1)
						this.$emit("on-node-delete", node)
						break;
					}
				}
			},
			handleMenu(e){
				const el = e.target;
				if(el.className === "zm-tree-menu-item") {
					const action = el.getAttribute("action");
					switch (action) {
            case "copy":
             this.handleCopy();
             break;
            case "add":
             this.handleAdd();
             break;
            case "edit":
             this.handleEdit();
             break;
            case "delete":
             this.handleDelete();
             break;
					}
					this.$emit("update:visible", false)
				}
			},
			handleCopy(){
        if (this.nodeCopy) {
          this.nodeCopy(this.node)
          return
        }
				this.copyText = this.node[this.props.label];
        this.$nextTick(()=>{
          this.$refs.copy.select(); // 选中文本
          document.execCommand("copy"); // 执行浏览器复制命令
          this.$emit("on-node-copy", this.copyText)
          this.$log.pretty('[提示] ', '文本复制成功', 'success')
        })
			},
			handleAdd(){
				if (this.nodeAdd) {
					this.nodeAdd(this.node)
					return
				}
				const { id, pid, label, expand, children } = this.props;
				const { node } = this
				const json = {
					[id]: "",
					[pid]: node[id],
					[label]: "",
					[expand]: false,
					[children]:[],
					newNode: true,
					focused: true,
				}
				if(Array.isArray(node[children])){
					node[children].push(json)
				} else {
					node[children] = [json]
				}
			},
			handleEdit(){
				if (this.nodeEdit) {
					this.nodeEdit(this.node)
					return
				}
				this.$set(this.node, "focused", true)
			},
			handleClose(e) {
				if (this.visible) {
					if (this.$el.contains(e.target)) {
						return false;
					}
					this.$emit("update:visible", false)
				}
      },
			afterEnter() {
        this.$emit('opened');
      },
      afterLeave() {
        this.$emit('closed');
      }
		}
	}
</script>
<style lang="scss" scoped>
	.zm-tree-contextmenu {
		position: fixed;
		top: 100px;
		left: 100px;
		z-index: 100;
		background: #fff;
		padding: 10px 0;
		overflow: hidden;
		border: 1px solid #ddd;
		box-shadow:  0px 2px 10px 0px rgba(29, 29, 31, 0.1);
		ul {
			list-style-type: none;
      padding: 0;
		}
		li {
			font-size: 12px;
			padding: 3px 10px;
			cursor: pointer;
      list-style-type: none;
			&:hover {
				color: #2d8cf0;
				background: #f0faff;
			}
		}
		.copy-textarea{
			position: absolute;
			top: -100px;
			left: -100px;
		}
	}
</style>