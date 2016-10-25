import {Judgement} from './scoring'
import {Color, White, Blue, Orange, Red, Green} from './color'
import {TweenValue} from './tween'
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

class TextSprite {
  font = 'Unica One'
  fontSize = 32
  align = 'center'
  opacity = 1

  constructor (
    public text = '',
    public x = 0,
    public y = 0,
    public color = White,
  ) {}

  draw () {
    canvas.layer(() => {
      canvas.setFillColor(this.color.opacity(this.opacity))
      canvas.setFont(`${this.fontSize}px ${this.font}`)
      canvas.setTextAlign(this.align)
      canvas.fillText(this.text, this.x, this.y)
    })
  }
}

export class JudgementAnimation {
  sprite = new TextSprite()
  offset = new TweenValue()
  opacity = new TweenValue()

  constructor () {
    this.sprite.fontSize = 60
  }

  play (judgement: Judgement) {
    this.sprite.text = JudgementText[judgement]
    this.sprite.color = JudgementColor[judgement]

    if (judgement !== Judgement.Break) {
      this.offset = new TweenValue(20, 0, 0.3)
      this.opacity = new TweenValue(1, 0, 0.3, 0.7)
    } else {
      this.offset = new TweenValue(0, 20, 1)
      this.opacity = new TweenValue(1, 0, 0.5, 0.5)
    }
  }

  update (dt: number) {
    this.offset.update(dt)
    this.opacity.update(dt)
  }

  draw (x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y + this.offset.value
    this.sprite.opacity = this.opacity.value
    this.sprite.draw()
  }
}