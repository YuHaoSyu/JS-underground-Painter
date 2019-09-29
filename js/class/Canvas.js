export default class Canvas {
  constructor(id, width, height) {
    this.canvas = document.querySelector(id)
    this.width = width || window.innerWidth
    this.height = height || window.innerHeight - 4
  }
  get area() {
    return this.canvas
  }
  get ctx() {
    return this.canvas.getContext('2d')
  }
  init(w, h) {
    this.canvas.width = w
    this.canvas.height = h
  }
  d2h(val) {
    let hex = (+val).toString(16)
    return val < 16 ? '0' + hex : hex
  }
  h2d(val, start, end) {
    let sliced = val.slice(start, end)
    return parseInt('0x' + sliced)
  }
  catchColor({ offsetX, offsetY }) {
    let imgData = this.ctx.getImageData(offsetX, offsetY, 1, 1).data
    let [r, g, b] = imgData
    let a = Math.round((imgData[3] / 255) * 10) / 10
    let colorStr = `rgba(${r},${g},${b},${a})`
    return colorStr
  }
  getColorArr({ offsetX, offsetY }) {
    return this.ctx.getImageData(offsetX, offsetY, 1, 1).data.slice(0, 3)
  }
}
