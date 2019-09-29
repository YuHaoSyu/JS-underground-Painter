import Canvas from './Canvas.js'
export default class Palette extends Canvas {
  constructor(id, width, height, barHeight) {
    super(id, width, height + barHeight * 2)
    this.color = [255, 0, 0]
    this.barHeight = barHeight
    this.init(this.width, this.height)
    this.gradientColor(this.color)
    this.colorBar()
    this.alphaBar(this.color)
  }
  set setColor(color) {
    this.color = color
  }
  get getColor() {
    return this.color
  }
  get getGDCHeight() {
    return this.height - this.barHeight
  }
  toggle() {
    this.canvas.classList.toggle('active')
    document.getElementById('paletteBtn').classList.toggle('active')
  }
  remove() {
    this.canvas.classList.remove('active')
    document.getElementById('paletteBtn').classList.remove('active')
  }
  colorBar() {
    let g = this.ctx.createLinearGradient(0, 0, this.width, 0)
    let colorStr = 'f00ff00f000ff0ff00'
    let y = this.height - this.barHeight * 2
    for (let i = 0; i < 6; i++) {
      let color = '#' + colorStr.slice(i * 3, i * 3 + 3)
      g.addColorStop(0.2 * i, color)
    }
    this.ctx.beginPath()
    this.ctx.rect(0, y, this.width, this.barHeight)
    this.ctx.fillStyle = g
    this.ctx.fill()
  }
  alphaBar(color) {
    let colorArr = [...color]
    let rgb = [...color]
    let a = this.ctx.createLinearGradient(0, 0, this.width, 0)
    let y = this.height - this.barHeight
    a.addColorStop(1, `rgba(${rgb.join(',')},0)`)
    a.addColorStop(0, `rgba(${rgb.join(',')},1)`)
    this.ctx.beginPath()
    this.ctx.rect(0, y, this.width, this.barHeight)
    this.ctx.fillStyle = a
    this.ctx.fill()
  }
  gradientColor(color) {
    this.ctx.beginPath()
    let colorArr = color
    let imax = 64
    let jmax = 64
    let sq = 8
    let arr = []
    for (let i = 0; i < imax * jmax; i++) arr.push([])
    arr[0] = [...colorArr]
    this.ctx.save()
    for (let i = 0; i < imax; i++) {
      let rgbi = arr[i * jmax + 1]

      for (let k = 0; k < 3; k++) {
        rgbi.push(Math.round(arr[0][k] + ((255 - arr[0][k]) / imax) * i))
      }

      this.ctx.save()
      for (let j = 0; j < jmax; j++) {
        let rgb = arr[i * jmax + j]

        for (let k = 0; k < 3; k++) {
          rgb[k] = Math.round((rgbi[k] / jmax) * (jmax - j))
        }

        this.ctx.fillStyle = `rgb(${rgb.join(',')})`
        this.ctx.fillRect(0, 0, sq, sq)
        this.ctx.translate(sq, 0)
      }
      this.ctx.restore()
      this.ctx.translate(0, sq)
    }
    this.ctx.restore()
  }
}
