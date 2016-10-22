import * as canvas from './canvas'
import {White} from './color'
import {lerp} from './util'

const {random, sin, cos, PI} = Math

export function NoteExplosion () {
  let particles = []

  function createParticle (ox, oy) {
    const direction = random() * PI * 2
    const x = cos(direction) * 20
    const y = sin(direction) * 10
    const tx = x * lerp(1, 5, random())
    const ty = y * lerp(1, 5, random())
    particles.push({ x, y, tx, ty, ox, oy, life: 1 })
  }

  function trigger (ox, oy) {
    for (let i = 0; i < 12; i++) {
      createParticle(ox, oy)
    }
  }

  function update (elapsed) {
    particles.forEach(part => {
      const {x, y, tx, ty} = part
      part.x = lerp(x, tx, elapsed * 6)
      part.y = lerp(y, ty, elapsed * 6)
      part.life -= elapsed * 4
    })

    particles = particles.filter(p => p.life > 0)
  }

  function draw () {
    particles.forEach(drawParticle)
  }

  function drawParticle ({ x, y, ox, oy, life }) {
    canvas.batch(() => {
      canvas.translate(ox + x, oy + y)
      canvas.rotate(-90)
      canvas.setShadow(0, 0, 8, White.opacity(life))
      canvas.setFillColor(White.opacity(life))
      canvas.circle(0, 0, 8, 3)
    })
  }

  return { update, draw, trigger }
}
