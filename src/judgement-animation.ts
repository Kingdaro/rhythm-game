import {Judgement} from './scoring'
import {Color, White, Blue, Orange, Red, Green} from './color'
import {TextSprite} from './text-sprite'
import {TweenGroup, TweenValue, Linear} from './tween'
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
  sprite = new TextSprite()

  constructor (public x = 0, public y = 0) {
    this.sprite.fontSize = 60
  }

  play (judgement: Judgement) {
    this.sprite.text = JudgementText[judgement]
    this.sprite.color = JudgementColor[judgement]

    if (judgement !== Judgement.Break) {
      this.sprite.tween('y', new TweenValue(this.y + 20, this.y, 0.3))
      this.sprite.tween('opacity', new TweenValue(1, 0, 0.3, 0.7))
    } else {
      this.sprite.tween('y', new TweenValue(this.y, this.y + 20, 1, 0, Linear))
      this.sprite.tween('opacity', new TweenValue(1, 0, 0.5, 0.5))
    }
  }

  update (dt: number) {
    this.sprite.update(dt)
    this.sprite.x = this.x
  }

  draw () {
    this.sprite.draw()
  }
}