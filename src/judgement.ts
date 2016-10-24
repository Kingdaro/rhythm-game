import * as canvas from './canvas'
import {clamp} from './util'
import {Blue, Orange, Green, Red} from './color'

export const enum Judgement { Absolute, Perfect, Good, Break }

export const TimingWindow = {
  [Judgement.Absolute]: 15 / 1000,
  [Judgement.Perfect]: 70 / 1000,
  [Judgement.Good]: 130 / 1000,
}

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
  animation = 0
  judgement = Judgement.Absolute

  play (score: Judgement) {
    this.animation = 1
    this.judgement = score
  }

  update (elapsed: number) {
    this.animation = clamp(this.animation - (elapsed / 0.8), 0, 1)
  }

  draw (x: number, y: number) {
    const text = JudgementText[this.judgement]
    const color = JudgementColor[this.judgement]
    const position = this.getPosition()
    const opacity = this.getOpacity()

    canvas.layer(() => {
      canvas.setFillColor(color.opacity(opacity))
      canvas.setFont('40pt Unica One')
      canvas.setTextAlign('center')
      canvas.fillText(text, x, y + position)
    })
  }

  getPosition () {
    if (this.judgement !== Judgement.Break) {
      return (this.animation ** 8) * 20
    } else {
      return (1 - this.animation) * 20
    }
  }

  getOpacity () {
    if (this.judgement !== Judgement.Break) {
      return clamp(this.animation * 5, 0, 1)
    } else {
      return clamp(this.animation * 2, 0, 1)
    }
  }
}

export function getJudgement (timing: number) {
  const diff = Math.abs(timing)
  if (diff <= TimingWindow[Judgement.Absolute]) return Judgement.Absolute
  if (diff <= TimingWindow[Judgement.Perfect]) return Judgement.Perfect
  if (diff <= TimingWindow[Judgement.Good]) return Judgement.Good
  return Judgement.Break
}

export function isMissed (timing: number) {
  return timing > TimingWindow[Judgement.Good]
}
