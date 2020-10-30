 //递归遍历实现
const getNodeById = function(node, key, value){
  if (node[key] === value) {
    return node;
  } else if (Array.isArray(node.children)) {
    let list = node.children;
    for (let i = 0, len = list.length; i < len; i++){
      let row = list[i];
      let pNode = getNodeById(row, key, value);
      if (pNode) {
        return pNode;
      }
    }
  }
}
 //移除节点
const removeNode = function(data, node, context){
  const { keys } = context;
  const { id, pid } = keys;
  const oldPaNode = getNodeById(data, id, node[pid]);
  const list = oldPaNode.children;
  console.log(list, id, node[pid])
  for(let i = 0, len = list.length; i < len; i ++){
    if(list[i][id] === node[id]) {
      list.splice(i, 1)
      break;
    }
  }
}

export default {
  bind(el, { modifiers, value }, vnode){
    let{ l, t } = modifiers;
    el.addEventListener("mousedown", handleDownCb)
    let offsetLeft, hasRender;
    let cloneTree = null;
    function handleDownCb(e){
        e.stopPropagation();
        if(value === false) {
          return
        }
        value.hidden = true;
        vnode.context.cloneData = value;
        vnode.context.nodeMoving = true;
        cloneTree = document.querySelector("#clone-tree-org");
        document.addEventListener("mousemove",handleMoveCb);
        document.addEventListener("mouseup",handleUpCb);
    }
    function handleMoveCb(e){
        e.preventDefault();
        if(!hasRender) {
          hasRender = true;
          cloneTree.style.opacity = 0.8;
          let rootNode = cloneTree.querySelector(".root-tree-org-node-label");
          offsetLeft = rootNode.offsetLeft + 2;
        }
        if((l&&t) && value){
            cloneTree.style.left = e.clientX - offsetLeft + "px";
            cloneTree.style.top = e.clientY + 2 + "px";
          return;
        }

        if(l&&value){
            el.style.left = e.clientX - offsetLeft+"px";
            return;
        }
        if(t&&value){
            el.style.top = e.clientY+"px";
            return;
        }
    }
    function handleUpCb(){
        cloneTree = null;
        value.hidden = false;
        vnode.context.nodeMoving = false;
        document.removeEventListener("mousemove",handleMoveCb);
        document.removeEventListener("mouseup",handleUpCb);
        const { parenNode } = vnode.context;
        if( parenNode ){
          const { data, keys } = vnode.context
          removeNode(data, value, vnode.context)
          value[keys.pid] = parenNode[keys.id];
          parenNode.children ? parenNode.children.push(value) : parenNode.children = [value]
        }
    }
  }
}