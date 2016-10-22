import * as canvas from './canvas'
import { Red, Orange, Gold, Green, Blue, Violet } from './color'

const colors = [ Red, Orange, Gold, Green, Blue, Violet ]

function Clock (limit) {
  let time = 0

  function update (elapsed) {
    time += elapsed
    if (time >= limit) {
      time -= limit
      return true
    }
    return false
  }

  return { update }
}

export function Background () {
  // private
  let shapes = []
  let clock = Clock(0.15)

  function addShape () {
    const x = Math.random() * canvas.width
    const y = canvas.height + 100
    const size = Math.random() * 2 + 2
    const color = colors[ Math.floor(Math.random() * colors.length) ]
    shapes.push({ x, y, size, color })
  }

  function drawShape ({ x, y, size, color }) {
    canvas.translate(x, y)
    canvas.rotate(-90)
    canvas.setFillColor(color)
    canvas.circle(0, 0, size * 20, 3)
  }

  function moveShapes (elapsed) {
    for (const shape of shapes) {
      shape.y -= shape.size * 40 * elapsed
    }
  }

  function cullShapes () {
    shapes = shapes.filter(shape => shape.y >= -100)
  }

  // public
  function update (elapsed) {
    if (elapsed > 1) return // no bullshit updates
    if (clock.update(elapsed)) addShape()
    moveShapes(elapsed)
    cullShapes()
  }

  function draw () {
    for (const shape of shapes) {
      canvas.batch(drawShape, shape)
    }
  }

  return { update, draw }
}
