import {Scene, FillColor, FillCircle, Translate, RotateDegrees} from './rendering'
import {rgb} from './color'

const colors = [
  rgb(231, 76, 60),
  rgb(52, 152, 219),
  rgb(46, 204, 113),
  rgb(230, 126, 34),
  rgb(155, 89, 182),
  rgb(241, 196, 15),
]

export function Background (width, height) {
  // private
  let shapes = []
  let timer = 0

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

  function render () {
    return Scene(
      ...shapes.map(({ x, y, size, color }) => {
        return Scene(
          Translate(x, y),
          RotateDegrees(-90),
          FillColor(color),
          FillCircle(0, 0, size * 30, 3),
        )
      })
    )
  }

  return { update, render }
}
