import * as canvas from './canvas'
import {Red, Orange, Gold, Green, Blue, Violet} from './color'
import {Clock} from './clock'
import {lerp, randomItem} from './util'

const {random} = Math
const colors = [Red, Orange, Gold, Green, Blue, Violet]

export class Background {
  sprites = []
  clock = new Clock(0.15)

  update (dt: number) {
    if (dt > 1) return

    if (this.clock.update(dt)) {
      this.sprites.push(this.createSprite())
      this.sprites.sort((a, b) => a.size - b.size)
    }

    this.sprites.forEach(sprite => sprite.y -= sprite.size * 40 * dt)
    this.sprites = this.sprites.filter(sprite => sprite.y > -100)
  }

  draw () {
    this.sprites.forEach(({ x, y, size, color }) => {
      canvas.fillTriangle(x, y, size * 20, color)
    })
  }

  createSprite () {
    const x = random() * canvas.width
    const y = canvas.height + 100
    const size = lerp(2, 5, random())
    const color = randomItem(colors)
    return { x, y, size, color }
  }
}
