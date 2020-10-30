export default {
  bind(el, { modifiers, value }){
    let{ l, t } = modifiers;
    el.addEventListener("mousedown",handleDownCb)
    let offsetLeft;
    let cloneTree = null;
    function handleDownCb(e){
        e.stopPropagation();
        // vnode.context.cloneData = value;
        cloneTree = document.querySelector("#clone-tree-org");
        let rootNode = cloneTree.querySelector(".tree-org-node");
        offsetLeft = rootNode.offsetLeft;
        // offsetTop = rootNode.offsetTop;
        cloneTree.style.left = e.clientX +"px";
        cloneTree.style.top = e.clientY +"px";
        document.addEventListener("mousemove",handleMoveCb);
        document.addEventListener("mouseup",handleUpCb);
    }
    function handleMoveCb(e){
        e.preventDefault();
        if((l&&t) && value){
            cloneTree.style.left = e.clientX - offsetLeft + "px";
            cloneTree.style.top = e.clientY + "px";
          return;
        }

        if(l&&value){
            el.style.left=e.clientX+"px";
            return;
        }
        if(t&&value){
            el.style.top=e.clientY+"px";
            return;
        }
    }
    function handleUpCb(){
        cloneTree = null;
        document.removeEventListener("mousemove",handleMoveCb);
        document.removeEventListener("mouseup",handleUpCb);
    }
  }
}