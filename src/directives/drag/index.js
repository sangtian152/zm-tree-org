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
const removeNode = function(node, context){
  const { keys, data } = context;
  const { id, pid } = keys;
  const oldPaNode = getNodeById(data, id, node[pid]);
  const list = oldPaNode.children;
  for(let i = 0, len = list.length; i < len; i ++){
    if(list[i][id] === node[id]) {
      list.splice(i, 1)
      break;
    }
  }
}
 //新增子节点节点
const addChildNode = function(node, context){
  const { parenNode } = context;
  if( parenNode ){
    const { keys } = context
    node[keys.pid] = parenNode[keys.id];
    parenNode.children ? parenNode.children.push(node) : parenNode.children = [node];
    removeNode(node, context)
  }
}
export default {
  bind(el, { modifiers, value }, vnode){
    let { l, t } = modifiers;
    const { drag, node, handleStart, handleMove, handleEnd } = value;
    el.addEventListener("mousedown", handleDownCb)
    let offsetLeft, hasRender;
    let cloneTree = null;
    function handleDownCb(e){
        e.stopPropagation();
        if(drag === false) {
          return
        }
        node.hidden = true;
        vnode.context.cloneData = node;
        vnode.context.nodeMoving = true;
        cloneTree = document.querySelector("#clone-tree-org");
        offsetLeft = el.offsetLeft + 2;
        cloneTree.style.opacity = 0.8;
        cloneTree.style.left = e.clientX - offsetLeft + "px";
        document.addEventListener("mousemove",handleMoveCb);
        document.addEventListener("mouseup",handleUpCb);
        handleEmit("start")
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
            handleEmit("move")
          return;
        }

        if(l&&value){
            el.style.left = e.clientX - offsetLeft+"px";
            handleEmit("move")
            return;
        }
        if(t&&value){
            el.style.top = e.clientY+"px";
            handleEmit("move")
            return;
        }
        
    }
    function handleUpCb(){
        cloneTree = null;
        node.hidden = false;
        vnode.context.nodeMoving = false;
        document.removeEventListener("mousemove",handleMoveCb);
        document.removeEventListener("mouseup",handleUpCb);
        addChildNode(node, vnode.context)
        handleEmit("end")
    }
    function handleEmit(type){
      if(type === "start") {
        typeof handleStart === "function" && handleStart(node);
        return
      }
      if(type === "move") {
        typeof handleMove === "function" && handleMove(node);
        return
      }
      if(type === "end") {
        typeof handleEnd === "function" && handleEnd(node);
        return
      }
    }
  }
}