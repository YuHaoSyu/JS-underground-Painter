import Canvas from './Canvas.js'

export default class Painter extends Canvas {
  constructor(id, width, height) {
    super(id, width, height)
    this.strokeStyle = '#000'
    this.fillStyle = '#fff'
    this.strokeWidth = 5
    this.lineCap = 'round'
    this.tool = 'brush'
    this.isWorking = false
    this.isErasing = false
    this.stack = []
    this.step = 0
    this.init(
      this.width,
      this.height,
      this.strokeWidth,
      this.strokeStyle,
      this.fillStyle
    )
    this.strokeCursor(this.strokeWidth, this.strokeStyle)
    this.image = new Image()
  }
  set toWork(bool) {
    let isTheseTool = ['brush', 'rect', 'circle', 'eraser'].some(
      e => e === this.tool
    )
    isTheseTool && (this.isWorking = bool)
  }
  get toWork() {
    return this.isWorking
  }
  set setTool(tool) {
    this.tool = tool
    this.update()
  }
  get getTool() {
    return this.tool
  }
  set setStrokeColor(color) {
    this.strokeStyle = color
    this.update()
  }
  set setFillColor(color) {
    this.fillStyle = color
    this.update()
  }
  get getStrokeColor() {
    return this.strokeStyle
  }
  get getFillColor() {
    return this.fillStyle
  }
  set setStack(val) {
    this.stack.length > this.step && (this.stack.length = this.step)
    this.stack.push(this.canvas.toDataURL())
    console.log(this.canvas.toDataURL())
    this.step += val
  }
  get getStack() {
    return this.stack
  }

  get getStrokeWidth() {
    return this.strokeWidth
  }
  set setStrokeWidth(val) {
    if (val > 0) {
      this.strokeWidth += val
    } else if (val < 0 && this.strokeWidth > 1) {
      this.strokeWidth += val
    }
    this.update()
  }
  get getDoneStep() {
    return this.step
  }
  strawColor(e) {
    if (this.tool === 'straw') {
      this.strokeStyle = super.catchColor(e)
      this.tool = 'brush'
      this.update()
    }
    return this.strokeStyle
  }
  init(w, h, strokeWidth, strokeStyle, fillStyle) {
    super.init(w, h)
    this.ctx.lineWidth = strokeWidth
    this.ctx.strokeStyle = strokeStyle
    this.ctx.fillStyle = fillStyle
    this.ctx.lineCap = this.lineCap
  }
  update() {
    this.ctx.lineWidth = this.strokeWidth
    this.ctx.strokeStyle = this.strokeStyle
    this.ctx.fillStyle = this.fillStyle
    let isTheseTool = ['brush', 'rect', 'circle'].some(e => e === this.tool)
    if (isTheseTool) {
      this.strokeCursor(this.strokeWidth, this.strokeStyle)
    } else if (this.tool === 'eraser') {
      this.eraserCuror(this.strokeWidth)
    } else if (this.tool === 'straw') {
      this.area.style.cursor = `url('./img/SVG/eyedropper.svg') 0 32, auto`
    }
  }
  strokeCursor(size, color) {
    let half = size / 2
    let area = size + 1
    let svg = `<svg xmlns='http://www.w3.org/2000/svg'
            width='${area}'
            height='${area}'>
        <circle fill='${color}'
                stroke='${color}'
                cx='50%'
                cy='50%'
                r='${half}'/></svg>`
    let base = window.btoa(svg)
    this.area.style.cursor = `url('data:image/svg+xml;base64,${base}') ${half} ${half},auto`
  }
  eraserCuror(size) {
    let half = size / 2
    let svg = `<svg xmlns='http://www.w3.org/2000/svg'
            width='${size}'
            height='${size}'>
        <rect fill='white'
              stroke='black'
              width='100%'
              height='100%'/></svg>`
    let base = window.btoa(svg)
    this.area.style.cursor = `url('data:image/svg+xml;base64,${base}') ${half} ${half}, auto`
  }
  clean() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  brush({ offsetX, offsetY }) {
    this.ctx.lineTo(offsetX, offsetY)
    this.ctx.stroke()
  }
  earser({ offsetX, offsetY }) {
    let width = this.getStrokeWidth
    let x = offsetX - width / 2
    let y = offsetY - width / 2
    this.ctx.clearRect(x, y, width, width)
  }
  reset() {
    this.step = 0
    this.stack.length = 0
  }
  save() {
    let link = document.createElement('a')
    link.download = prompt('輸入檔名', 'htmlCanvas') + '.png'
    link.href = this.canvas.toDataURL('image/png;base64')
    link.click()
  }
  load() {
    let _this = this
    var upload = document.createElement('input')
    upload.type = 'file'
    upload.accept = 'image/png'
    upload.addEventListener('change', function() {
      let reader = new FileReader()
      reader.readAsDataURL(this.files[0]) //轉化成base64資料型別
      reader.addEventListener('load', function() {
        _this.drawingImg(reader.result)
      })
    })
    upload.click()
  }
  undo() {
    if (this.step) {
      this.step -= 1
      let base64 = this.stack[this.step - 1]
      base64 ? this.drawingImg(base64) : this.clean()
    }
  }
  redo() {
    if (this.stack.length > this.step) {
      this.step += 1
      let base64 = this.stack[this.step - 1]
      this.drawingImg(base64)
    }
  }
  drawingImg(base64, shape) {
    let _this = this
    this.image.src = base64
    this.image.addEventListener('load', function() {
      _this.clean()
      _this.ctx.drawImage(_this.image, 0, 0)
      shape && shape()
    })
  }
  drawingRect({ offsetX, offsetY }, { x, y }) {
    let _this = this
    let w = offsetX - x
    let h = offsetY - y
    if (this.step) {
      this.drawingImg(this.getStack[this.getDoneStep - 1], rect)
    } else {
      this.clean()
      rect()
    }
    function rect() {
      _this.ctx.beginPath()
      _this.ctx.rect(x, y, w, h)
      _this.ctx.stroke()
      _this.ctx.fill()
    }
  }
  drawCircle({ offsetX, offsetY }, { cx, cy }) {
    let _this = this
    let x = Math.pow(offsetX - cx, 2)
    let y = Math.pow(offsetY - cy, 2)
    let r = Math.round(Math.sqrt(x + y))
    if (this.step) {
      this.drawingImg(this.getStack[this.getDoneStep - 1], circle)
    } else {
      this.clean()
      circle()
    }
    function circle() {
      _this.ctx.beginPath()
      _this.ctx.arc(cx, cy, r, 0, Math.PI * 2)
      _this.ctx.stroke()
      _this.ctx.fill()
    }
  }
}
