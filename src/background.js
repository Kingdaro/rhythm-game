import {rgb} from './color'
import {triangle} from './drawutils'

const colors = [
  rgb(231, 76, 60),
  rgb(52, 152, 219),
  rgb(46, 204, 113),
  rgb(230, 126, 34),
  rgb(155, 89, 182),
  rgb(241, 196, 15),
]

export function Background (width, height) {
  let shapes = []
  let timer = 0

  // private
  function addShape () {
    const x = Math.random() * width
    const y = height + 100
    const size = Math.random() * 2 + 2
    const color = colors[ Math.floor(Math.random() * colors.length) ]
    shapes.push({ x, y, size, color })
  }

  function moveShape (shape, dx, dy) {
    shape.x += dx
    shape.y += dy
    return shape
  }

  function moveShapes (elapsed) {
    const move = shape => moveShape(shape, 0, -shape.size * 40 * elapsed)
    return shapes.map(move)
  }

  function cullShapes () {
    return shapes.filter(shape => shape.y >= -100)
  }

  function drawShape (ctx, { x, y, color, size }) {
    ctx.save()
    ctx.fillStyle = color.toString()
    ctx.translate(x, y)
    ctx.scale(1, 1.1)
    ctx.translate(-x, -y)
    triangle(ctx, x, y, size * 20)
    ctx.restore()
  }

  // public
  function update (elapsed) {
    if (elapsed > 1) return // no bullshit updates

    timer += elapsed

    if (timer >= 0.15) {
      timer = 0
      addShape()
    }

    shapes = moveShapes(elapsed)
    shapes = cullShapes()
  }

  function draw (ctx) {
    shapes.forEach(shape => drawShape(ctx, shape))

    ctx.font = '14pt Roboto'
    ctx.fillStyle = 'black'
    ctx.fillText(`Shapes: ${shapes.length}`, 10, 30)
  }

  return { update, draw }
}
