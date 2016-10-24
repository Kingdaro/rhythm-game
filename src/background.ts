import * as canvas from './canvas'
import {Red, Orange, Gold, Green, Blue, Violet} from './color'
import {Clock} from './clock'
import {lerp, randomItem} from './util'

const colors = [ Red, Orange, Gold, Green, Blue, Violet ]

class Shape {
  x = Math.random() * canvas.width
  y = canvas.height + 100
  size = lerp(2, 5, Math.random())
  color = randomItem(colors)

  draw () {
    canvas.layer(() => {
      canvas.translate(this.x, this.y)
      canvas.rotate(-90)
      canvas.setFillColor(this.color)
      canvas.circle(0, 0, this.size * 20, 3)
    })
  }
}

export class Background {
  shapes: Shape[] = []
  clock = new Clock(0.15)

  update (dt: number) {
    if (dt > 1) return

    if (this.clock.update(dt)) {
      this.shapes.push(new Shape())
      this.shapes.sort((a, b) => a.size - b.size)
    }

    this.shapes.forEach(shape => shape.y -= shape.size * 40 * dt)
    this.shapes = this.shapes.filter(shape => shape.y > -100)
  }

  draw () {
    this.shapes.forEach(shape => shape.draw())
  }
}
