import * as canvas from './canvas'
import * as util from './util'
import {Cloudy} from './color'

export class ComboAnimation {
  combo = 0
  time = 1

  add (combo: number) {
    if (combo > 0) {
      this.combo += combo
      this.time = 0
    }
  }

  reset () {
    this.combo = 0
  }

  update (dt: number) {
    this.time = util.lerp(this.time, 1, dt * 15)
  }

  draw (x: number, y: number) {
    if (this.combo < 1) return

    canvas.setFont('72px Unica One')
    canvas.setTextAlign('center')

    canvas.layer(() => {
      const scale = util.lerp(0.8, 1, this.time)
      canvas.translate(x, y)
      canvas.ctx.scale(scale, scale)
      canvas.setFillColor(Cloudy)
      canvas.fillText(this.combo.toString(), 0, 0)
    })
  }
}
