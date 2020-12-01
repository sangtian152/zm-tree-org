<template>
  <div
    :style="style"
    :class="[{
      [classNameActive]: enabled,
      [classNameDragging]: dragging,
      [classNameDraggable]: draggable,
    }, className]"
    @mousedown="elementMouseDown"
    @touchstart="elementTouchDown"
  >
    <slot></slot>
  </div>
</template>

<script>
import { matchesSelectorToParentElements, getComputedSize, addEvent, removeEvent } from '@/utils/dom'
import { restrictToBounds, snapToGrid } from '@/utils/fns'

const events = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  }
}

const userSelectNone = {
  userSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  MsUserSelect: 'none'
}

const userSelectAuto = {
  userSelect: 'auto',
  MozUserSelect: 'auto',
  WebkitUserSelect: 'auto',
  MsUserSelect: 'auto'
}

let eventsFor = events.mouse

export default {
  replace: true,
  name: 'zm-draggable',
  props: {
    className: {
      type: String,
      default: 'zm-draggable'
    },
    classNameDraggable: {
      type: String,
      default: 'draggable'
    },
    classNameDragging: {
      type: String,
      default: 'dragging'
    },
    classNameActive: {
      type: String,
      default: 'active'
    },
    disableUserSelect: {
      type: Boolean,
      default: true
    },
    enableNativeDrag: {
      type: Boolean,
      default: false
    },
    preventDeactivation: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    lockAspectRatio: {
      type: Boolean,
      default: false
    },
    w: {
      type: [Number, String],
      default: 200,
      validator: (val) => {
        if (typeof val === 'number') {
          return val > 0
        }

        return val === 'auto'
      }
    },
    h: {
      type: [Number, String],
      default: 200,
      validator: (val) => {
        if (typeof val === 'number') {
          return val > 0
        }

        return val === 'auto'
      }
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    z: {
      type: [String, Number],
      default: 'auto',
      validator: (val) => (typeof val === 'string' ? val === 'auto' : val >= 0)
    },
    dragHandle: {
      type: String,
      default: null
    },
    dragCancel: {
      type: String,
      default: null
    },
    axis: {
      type: String,
      default: 'both',
      validator: (val) => ['x', 'y', 'both'].includes(val)
    },
    grid: {
      type: Array,
      default: () => [1, 1]
    },
    parent: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1,
      validator: (val) => val > 0
    },
    onDragStart: {
      type: Function,
      default: () => true
    },
    onDrag: {
      type: Function,
      default: () => true
    },
  },

  data: function () {
    return {
      left: this.x,
      top: this.y,
      right: null,
      bottom: null,

      width: null,
      height: null,

      widthTouched: false,
      heightTouched: false,

      aspectFactor: null,

      parentWidth: null,
      parentHeight: null,

      enabled: this.active,
      dragging: false,
      zIndex: this.z
    }
  },

  created() {

    this.resetBoundsAndMouseState()
  },
  mounted() {
    if (!this.enableNativeDrag) {
      this.$el.ondragstart = () => false
    }

    const [parentWidth, parentHeight] = this.getParentSize()

    this.parentWidth = parentWidth
    this.parentHeight = parentHeight

    const [width, height] = getComputedSize(this.$el)

    this.aspectFactor = (this.w !== 'auto' ? this.w : width) / (this.h !== 'auto' ? this.h : height)

    this.width = this.w !== 'auto' ? this.w : width
    this.height = this.h !== 'auto' ? this.h : height

    this.right = this.parentWidth - this.width - this.left
    this.bottom = this.parentHeight - this.height - this.top

    addEvent(document.documentElement, 'mousedown', this.deselect)
    addEvent(document.documentElement, 'touchend touchcancel', this.deselect)

    addEvent(window, 'resize', this.checkParentSize)
  },
  beforeDestroy() {
    removeEvent(document.documentElement, 'mousedown', this.deselect)
    removeEvent(document.documentElement, 'touchstart', this.handleUp)
    removeEvent(document.documentElement, 'mousemove', this.move)
    removeEvent(document.documentElement, 'touchmove', this.move)
    removeEvent(document.documentElement, 'mouseup', this.handleUp)
    removeEvent(document.documentElement, 'touchend touchcancel', this.deselect)

    removeEvent(window, 'resize', this.checkParentSize)
  },

  methods: {
    resetBoundsAndMouseState () {
      this.mouseClickPosition = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 }

      this.bounds = {
        minLeft: null,
        maxLeft: null,
        minRight: null,
        maxRight: null,
        minTop: null,
        maxTop: null,
        minBottom: null,
        maxBottom: null
      }
    },
    checkParentSize () {
      if (this.parent) {
        const [newParentWidth, newParentHeight] = this.getParentSize()

        this.parentWidth = newParentWidth
        this.parentHeight = newParentHeight
      }
    },
    getParentSize () {
      if (this.parent) {
        const style = window.getComputedStyle(this.$el.parentNode, null)

        return [
          parseInt(style.getPropertyValue('width'), 10),
          parseInt(style.getPropertyValue('height'), 10)
        ]
      }

      return [null, null]
    },
    elementTouchDown (e) {
      eventsFor = events.touch

      this.elementDown(e)
    },
    elementMouseDown (e) {
      eventsFor = events.mouse

      this.elementDown(e)
    },
    elementDown (e) {
      if (e instanceof MouseEvent && e.which !== 1) {
        return
      }

      const target = e.target || e.srcElement

      if (this.$el.contains(target)) {
        if (this.onDragStart(e) === false) {
          return
        }

        if (
          (this.dragHandle && !matchesSelectorToParentElements(target, this.dragHandle, this.$el)) ||
          (this.dragCancel && matchesSelectorToParentElements(target, this.dragCancel, this.$el))
        ) {
          this.dragging = false

          return
        }

        if (!this.enabled) {
          this.enabled = true

          this.$emit('activated')
          this.$emit('update:active', true)
        }

        if (this.draggable) {
          this.dragging = true
        }

        this.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX
        this.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY

        this.mouseClickPosition.left = this.left
        this.mouseClickPosition.right = this.right
        this.mouseClickPosition.top = this.top
        this.mouseClickPosition.bottom = this.bottom

        if (this.parent) {
          this.bounds = this.calcDragLimits()
        }

        addEvent(document.documentElement, eventsFor.move, this.move)
        addEvent(document.documentElement, eventsFor.stop, this.handleUp)
      }
    },
    calcDragLimits () {
      return {
        minLeft: this.left % this.grid[0],
        maxLeft: Math.floor((this.parentWidth - this.width - this.left) / this.grid[0]) * this.grid[0] + this.left,
        minRight: this.right % this.grid[0],
        maxRight: Math.floor((this.parentWidth - this.width - this.right) / this.grid[0]) * this.grid[0] + this.right,
        minTop: this.top % this.grid[1],
        maxTop: Math.floor((this.parentHeight - this.height - this.top) / this.grid[1]) * this.grid[1] + this.top,
        minBottom: this.bottom % this.grid[1],
        maxBottom: Math.floor((this.parentHeight - this.height - this.bottom) / this.grid[1]) * this.grid[1] + this.bottom
      }
    },
    deselect (e) {
      const target = e.target || e.srcElement
      if (!this.$el.contains(target)) {
        if (this.enabled && !this.preventDeactivation) {
          this.enabled = false

          this.$emit('deactivated')
          this.$emit('update:active', false)
        }
      }
      this.resetBoundsAndMouseState()
    },
    move (e) {
      if (this.dragging) {
        this.handleDrag(e)
      }
    },
    handleDrag (e) {
      const axis = this.axis
      const grid = this.grid
      const bounds = this.bounds
      const mouseClickPosition = this.mouseClickPosition

      const tmpDeltaX = axis && axis !== 'y' ? mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX) : 0
      const tmpDeltaY = axis && axis !== 'x' ? mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY) : 0

      const [deltaX, deltaY] = snapToGrid(grid, tmpDeltaX, tmpDeltaY, this.scale)

      const left = restrictToBounds(mouseClickPosition.left - deltaX, bounds.minLeft, bounds.maxLeft)
      const top = restrictToBounds(mouseClickPosition.top - deltaY, bounds.minTop, bounds.maxTop)

      if (this.onDrag(left, top) === false) {
        return
      }

      const right = restrictToBounds(mouseClickPosition.right + deltaX, bounds.minRight, bounds.maxRight)
      const bottom = restrictToBounds(mouseClickPosition.bottom + deltaY, bounds.minBottom, bounds.maxBottom)

      this.left = left
      this.top = top
      this.right = right
      this.bottom = bottom

      this.$emit('dragging', this.left, this.top)
    },
    moveHorizontally (val) {
      const [deltaX, _] = snapToGrid(this.grid, val, this.top, this.scale)

      const left = restrictToBounds(deltaX, this.bounds.minLeft, this.bounds.maxLeft)

      this.left = left
      this.right = this.parentWidth - this.width - left
    },
    moveVertically (val) {
      const [_, deltaY] = snapToGrid(this.grid, this.left, val, this.scale)

      const top = restrictToBounds(deltaY, this.bounds.minTop, this.bounds.maxTop)

      this.top = top
      this.bottom = this.parentHeight - this.height - top
    },
    handleUp () {
      this.resetBoundsAndMouseState()
      if (this.dragging) {
        this.dragging = false
        this.$emit('dragstop', this.left, this.top)
      }
    }
  },
  computed: {
    style () {
      return {
        transform: `translate(${this.left}px, ${this.top}px)`,
        zIndex: this.zIndex,
        ...(this.dragging && this.disableUserSelect ? userSelectNone : userSelectAuto)
      }
    },
  },

  watch: {
    active (val) {
      this.enabled = val

      if (val) {
        this.$emit('activated')
      } else {
        this.$emit('deactivated')
      }
    },
    z (val) {
      if (val >= 0 || val === 'auto') {
        this.zIndex = val
      }
    },
    x (val) {
      if (this.dragging) {
        return
      }

      if (this.parent) {
        this.bounds = this.calcDragLimits()
      }

      this.moveHorizontally(val)
    },
    y (val) {
      if (this.dragging) {
        return
      }

      if (this.parent) {
        this.bounds = this.calcDragLimits()
      }

      this.moveVertically(val)
    },
    lockAspectRatio (val) {
      if (val) {
        this.aspectFactor = this.width / this.height
      } else {
        this.aspectFactor = undefined
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  .zm-draggable {
    touch-action: none;
    position: absolute;
    box-sizing: border-box;
  }
</style>