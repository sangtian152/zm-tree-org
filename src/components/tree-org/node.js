const EVENTS = {
  CLICK: 'on-node-click',
  MOUSEENTER: 'on-node-mouseenter',
  MOUSELEAVE: 'on-node-mouseleave'
}

function createListener (handler, data) {
  if (typeof handler === 'function') {
    return function (e) {
      if (e.target.className.indexOf('org-tree-node-btn') > -1) return

      handler.apply(null, [e, data])
    }
  }
}
// 判断是否叶子节点
const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0)
}

// 创建 node 节点
export const renderNode = (h, data, context, root) => {
  const { props } = context;
  const { directives } = context.data;
  const cls = ['tree-org-node']
  const childNodes = []
  const children = data[props.props.children]
  // 如果是叶子节点则追加leaf事件
  if (isLeaf(data, props.props.children)) {
    cls.push('is-leaf')
  } else if (props.collapsable && !data[props.props.expand]) { // 追加是否展开class
    cls.push('collapsed')
  }
  // 渲染label块
  childNodes.push(renderLabel(h, data, context, root))

  if (!props.collapsable || data[props.props.expand]) {
    childNodes.push(renderChildren(h, children, context))
  }
  let cloneDirs 
  if(Array.isArray(directives)){
    cloneDirs = directives.map(item=>{
      return Object.assign({value: data}, item)
    })
  }
  return h('div', {
    'class': cls,
    'directives': cloneDirs,
  }, childNodes)
}

// 创建展开折叠按钮
export const renderBtn = (h, data, { props, listeners }) => {
  const expandHandler = listeners['on-expand']

  let cls = ['tree-org-node-btn']

  if (data[props.props.expand]) {
    cls.push('expanded')
  }

  return h('span', {
    'class': cls,
    on: {
      click: e => expandHandler && expandHandler(e, data)
    }
  })
}

// 创建 label 节点
export const renderLabel = (h, data, context, root) => {
  const { props, listeners } = context
  const label = data[props.props.label]
  const renderContent = props.renderContent

  // event handlers
  const clickHandler = listeners[EVENTS.CLICK]
  const mouseenterHandler = listeners[EVENTS.MOUSEENTER]
  const mouseleaveHandler = listeners[EVENTS.MOUSELEAVE]

  const childNodes = []
  if (typeof renderContent === 'function') {
    let vnode = renderContent(h, data)

    vnode && childNodes.push(vnode)
  } else {
    childNodes.push(label)
  }

  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context))
  }

  const cls = ['tree-org-node-label-inner']
  let { labelStyle, labelClassName, selectedClassName, selectedKey } = props

  if (typeof labelClassName === 'function') {
    labelClassName = labelClassName(data)
  }

  labelClassName && cls.push(labelClassName)
  data.className && cls.push(data.className)
  // add selected class and key from props
  if (typeof selectedClassName === 'function') {
    selectedClassName = selectedClassName(data)
  }

  selectedClassName && selectedKey && data[selectedKey] && cls.push(selectedClassName)
  const nodeLabelClass = ['tree-org-node-label'];
  if (root) {
    nodeLabelClass.push('root-tree-org-node-label')
  }
  return h('div', {
    'class': nodeLabelClass
  }, [h('div', {
    'class': cls,
    style: data['style'] ? data['style'] : labelStyle,
    on: {
      'click': createListener(clickHandler, data),
      'mouseenter': createListener(mouseenterHandler, data),
      'mouseleave': createListener(mouseleaveHandler, data)
    }
  }, childNodes)])
}

// 创建 node 子节点
export const renderChildren = (h, list, context) => {
  if (Array.isArray(list) && list.length) {
    const children = list.map(item => {
      return renderNode(h, item, context, false)
    })

    return h('div', {
      'class': 'tree-org-node-children'
    }, children)
  }
  return ''
}

export const render = (h, context) => {
  const { props } = context
  return renderNode(h, props.data, context, true)
}

export default render
