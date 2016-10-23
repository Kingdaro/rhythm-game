import * as canvas from './canvas'
import {White} from './color'
import {lerp} from './util'

const {random, sin, cos, PI} = Math

class Particle {
  x: number
  y: number
  tx: number
  ty: number
  life = 1

  constructor (private ox: number, private oy: number) {
    const direction = random() * PI * 2
    this.x = cos(direction) * 20
    this.y = sin(direction) * 10
    this.tx = this.x * lerp(1, 5, random())
    this.ty = this.y * lerp(1, 5, random())
  }

  update (elapsed: number) {
    this.x = lerp(this.x, this.tx, elapsed * 6)
    this.y = lerp(this.y, this.ty, elapsed * 6)
    this.life -= elapsed * 4
  }

  draw () {
    canvas.layer(() => {
      canvas.translate(this.ox + this.x, this.oy + this.y)
      canvas.rotate(-90)
      canvas.setShadow(0, 0, 8, White.opacity(this.life))
      canvas.setFillColor(White.opacity(this.life))
      canvas.circle(0, 0, 8, 3)
    })
  }

  isAlive () {
    return this.life > 1
  }
}

export class NoteExplosion {
  particles = []

  createParticle (ox: number, oy: number) {
    this.particles.push(new Particle(ox, oy))
  }

  trigger (ox: number, oy: number) {
    for (let i = 0; i < 12; i++) {
      this.createParticle(ox, oy)
    }
  }

  update (elapsed: number) {
    this.particles.forEach(part => part.update(elapsed))
    this.particles = this.particles.filter(p => p.isAlive())
  }

  draw () {
    this.particles.forEach(part => part.draw())
  }
}
