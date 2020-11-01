 //递归遍历实现
const getNodeById = function(node, keys, value){
  const { id, children } = keys;
  if (node[id] === value) {
    return node;
  } else if (Array.isArray(node[children])) {
    let list = node[children];
    for (let i = 0, len = list.length; i < len; i++){
      let row = list[i];
      let pNode = getNodeById(row, keys, value);
      if (pNode) {
        return pNode;
      }
    }
  }
}
 //移除节点
const removeNode = function(node, context){
  const { keys, data, onlyOneNode } = context;
  const { id, pid, children } = keys;
  const oldPaNode = getNodeById(data, keys, node[pid]);
  const list = oldPaNode[children];
  let index;
  for(let i = 0, len = list.length; i < len; i ++){
    if(list[i][id] === node[id]) {
      list.splice(i, 1)
      index = i;
      break;
    }
  }
  // 如果仅移动当前节点，把当前节点的子节点添加到当前节点的父节点，并把当前节点子节点移除
  const childNodes = node[children];
  if (onlyOneNode && index && childNodes) {
    node[children] = [];
    childNodes.forEach(it => {
      it[pid] = oldPaNode[id];
    })
    oldPaNode[children].splice(index, 0, ...childNodes)
  }
}
 //新增子节点节点
const addChildNode = function(node, context){
  const { parenNode, onlyOneNode, cloneNodeDrag } = context;
  if( parenNode ){
    const { keys } = context;
    if (!cloneNodeDrag) {
      // 如果拖拽节点
      removeNode(node, context)
      node[keys.pid] = parenNode[keys.id];
      parenNode.children ? parenNode.children.push(node) : parenNode.children = [node];
    } else {
      // 如果拷贝并拖拽节点
      const nodeClone = JSON.parse(JSON.stringify(node));
      const { children } = keys;
      if (onlyOneNode && Array.isArray(nodeClone[children])){
        nodeClone[children] = [];
      }
      nodeClone[keys.pid] = parenNode[keys.id];
      parenNode.children ? parenNode.children.push(nodeClone) : parenNode.children = [nodeClone];
    }
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
        if(drag === false || e.button!=0 || node.focused) {
          return
        }
        const { context } = vnode;
        const { keys, onlyOneNode } = context;
        if (onlyOneNode) { // 如果是仅移动当前节点
          const { children } = keys;
          const cloneNode = {...node};
          cloneNode[children] = [];
          context.cloneData = cloneNode;
        } else {
          context.cloneData = node;
        }
        context.nodeMoving = true;
        // 拖动节点副本
        cloneTree = document.querySelector("#clone-tree-org");
        offsetLeft = el.offsetLeft + 2;
        cloneTree.style.opacity = 0.8;
        cloneTree.style.left = e.clientX - offsetLeft + "px";
        cloneTree.style.top = e.clientY + 2 + "px";
        node.moving = true;
        document.addEventListener("mousemove",handleMoveCb);
        document.addEventListener("mouseup",handleUpCb);
        handleEmit("start")
    }
    function handleMoveCb(e){
        e.preventDefault();
        if(!hasRender) {
          hasRender = true;
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
    function handleUpCb(e){
        cloneTree = null;
        node.moving = false;
        vnode.context.nodeMoving = false;
        document.removeEventListener("mousemove",handleMoveCb);
        document.removeEventListener("mouseup",handleUpCb);
        const movingNode = document.querySelector(".tree-org-node-moving");
        if (movingNode.contains(e.target)) {
          handleEmit("end", true)
          return false;
        }
        addChildNode(node, vnode.context)
        handleEmit("end", false)
    }
    function handleEmit(type, isSelf){
      if(type === "start") {
        typeof handleStart === "function" && handleStart(node);
        return
      }
      if(type === "move") {
        typeof handleMove === "function" && handleMove(node);
        return
      }
      if(type === "end") {
        typeof handleEnd === "function" && handleEnd(node, isSelf);
        return
      }
    }
  }
}