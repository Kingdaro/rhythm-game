import {Judgement} from './scoring'
import {Blue, Orange, Red, Green} from './color'
import * as canvas from './canvas'
import * as util from './util'

const JudgementColor = {
  [Judgement.Absolute]: Blue,
  [Judgement.Perfect]: Orange,
  [Judgement.Good]: Green,
  [Judgement.Break]: Red,
}

const JudgementText = {
  [Judgement.Absolute]: 'ABSOLUTE',
  [Judgement.Perfect]: 'PERFECT',
  [Judgement.Good]: 'GOOD',
  [Judgement.Break]: 'BREAK',
}

export class JudgementAnimation {
  time = 0
  judgement = Judgement.None

  play (score: Judgement) {
    this.time = 1
    this.judgement = score
  }

  update (dt: number) {
    this.time = util.clamp(this.time - (dt / 0.8), 0, 1)
  }

  draw (x: number, y: number) {
    if (this.judgement === Judgement.None) return

    const text = JudgementText[this.judgement]
    const color = JudgementColor[this.judgement]
    const position = this.getPosition()
    const opacity = this.getOpacity()

    canvas.layer(() => {
      canvas.setFillColor(color.opacity(opacity))
      canvas.setFont('60px Unica One')
      canvas.setTextAlign('center')
      canvas.fillText(text, x, y + position)
    })
  }

  getPosition (): number {
    if (this.judgement !== Judgement.Break) {
      return (this.time ** 8) * 20
    } else {
      return (1 - this.time) * 20
    }
  }

  getOpacity (): number {
    if (this.judgement !== Judgement.Break) {
      return util.clamp(this.time * 5, 0, 1)
    } else {
      return util.clamp(this.time * 2, 0, 1)
    }
  }
}