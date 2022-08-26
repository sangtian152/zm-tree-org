import { isObject } from "@/utils/utils"
// 递归遍历处理数据
const recurseData = function(data, keys, cb){
  const { children } = keys;
  if (isObject(data)) {
    fn(data)
  } else if (Array.isArray(data)){
    for (let i = 0, len = data.length; i < len; i++){
      fn(data[i]);
    }
  }
  function fn(obj) {
    cb(obj)
    if(Array.isArray(obj[children])){
    const list = obj[children];
      for (let i = 0, len = list.length; i < len; i++){
        fn(list[i]);
      }
    }
  }
}
 // 获取父级节点
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
  if (onlyOneNode && index !== undefined && childNodes) {
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
    const { id, pid } = keys;
    const nodeClone = JSON.parse(JSON.stringify(node));
    if(nodeClone.root) {
      nodeClone.root = undefined;
    }
    if (!cloneNodeDrag) {
      // 如果拖拽节点
      removeNode(nodeClone, context)
      nodeClone[pid] = parenNode[id];
      parenNode.children ? parenNode.children.push(nodeClone) : parenNode.children = [].concat(nodeClone);
    } else {
      // 如果拷贝并拖拽节点
      recurseData(nodeClone, keys, function(item){
        if(typeof item[id] === "string"
          && item[id].indexOf("clone-node") != -1){
          item[id] = `clone-node-${item[id]}`
        }
      })
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
    const { drag, node, beforeDragEnd } = value;
    el.addEventListener("mousedown", handleDownCb)
    let offsetLeft = 0, hasRender = false;
    let cloneTree = null;
    let screenX = 0, screenY = 0;
    function initData(e){ // 初始化拖动数据
      e.stopPropagation();
      screenX = e.screenX;
      screenY = e.screenY;
      offsetLeft = 0;
      const { context } = vnode;
      context.contextmenu = false; // 隐藏右键菜单
      const { keys, onlyOneNode } = context;
      if (onlyOneNode) { // 如果是仅移动当前节点
        const { children } = keys;
        const cloneNode = {...node};
        cloneNode[children] = [];
        context.cloneData = cloneNode;
      } else {
        context.cloneData = JSON.parse(JSON.stringify(node));
      }
    }
    function handleDownCb(e){
      if( drag === false 
        || e.button!=0 
        || node.focused 
        || node.noDragging
        || e.target.className.indexOf('tree-org-node-btn') > -1) {
        return false
      }
      initData(e);
      document.addEventListener("mousemove",handleMoveCb);
      document.addEventListener("mouseup", handleUpCb);
      handleEmit("start")
    }
    function moveStart(e){
      const { context } = vnode;
      context.nodeMoving = true;
      context.stopClick = true;
      node.moving = true;
      let ndom = el;
      while(!ndom.classList.contains("tree-org-node")){
        offsetLeft += ndom.offsetLeft;
        ndom = ndom.offsetParent;
      }
      // 拖动节点副本
      offsetLeft = offsetLeft + 2;
      cloneTree = document.querySelector("#clone-tree-org");
      cloneTree.style.width = `${ndom.clientWidth}px`;
      cloneTree.style.opacity = 0.8;
      cloneTree.style.left = e.clientX - offsetLeft + "px";
      cloneTree.style.top = e.clientY + 2 + "px";
    }
    function handleMoveCb(e){
      e.preventDefault();
      if (Math.abs(e.screenX - screenX) < 5
        && Math.abs(e.screenY - screenY) < 5){
        return false
      }
      if(!hasRender) {
        hasRender = true;
        moveStart(e)
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
      document.removeEventListener("mousemove",handleMoveCb);
      document.removeEventListener("mouseup",handleUpCb);
      if (!hasRender) {
        return
      }
      if (typeof beforeDragEnd === 'function') {
        const before = beforeDragEnd(node, vnode.context.parenNode)
        if (before && before.then) {
          before.then(() => {
            doDragEnd(e)
          }, () => {})
        } else if (before !== false) {
          doDragEnd(e)
        }
      } else {
        doDragEnd(e)
      }
      reset()
    }
    function reset() {
      hasRender = false;
      cloneTree = null;
      delete node.moving;
      vnode.context.nodeMoving = false;
      setTimeout(() => {
        vnode.context.stopClick = false
      }, 200)
    }
    function doDragEnd(e) {
      const movingNode = document.querySelector(".tree-org-node__moving");
      if (movingNode && movingNode.contains(e.target)) {
        handleEmit("end")
        return false;
      }
      delete node.moving;
      addChildNode(node, vnode.context)
      handleEmit("end")
    }
    function handleEmit(type){
      const { $listeners, parenNode } = vnode.context;
      if(type === "start") {
        $listeners['on-node-drag-start'] && $listeners['on-node-drag-start'](node);
        return
      }
      if(type === "move") {
        $listeners['on-node-drag'] && $listeners['on-node-drag'](node);
        return
      }
      if(type === "end") {
        $listeners['on-node-drag-end'] && $listeners['on-node-drag-end'](node, parenNode);
        return
      }
    }
  }
}