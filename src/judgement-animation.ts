import {Judgement} from './scoring'
import {Color, White, Blue, Orange, Red, Green} from './color'
import {TextSprite} from './text-sprite'
import {TweenGroup, Linear} from './tween'
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
  tweens = new TweenGroup()

  constructor (public x = 0, public y = 0) {
    this.sprite.fontSize = 60
  }

  play (judgement: Judgement) {
    this.sprite.text = JudgementText[judgement]
    this.sprite.color = JudgementColor[judgement]

    if (judgement !== Judgement.Break) {
      this.tweens.add('offset', 20, 0, 0.3)
      this.tweens.add('opacity', 1, 0, 0.3, 0.7)
    } else {
      this.tweens.add('offset', 0, 20, 1, 0, Linear)
      this.tweens.add('opacity', 1, 0, 0.5, 0.5)
    }
  }

  update (dt: number) {
    this.tweens.update(dt)
  }

  draw () {
    this.sprite.x = this.x
    this.sprite.y = this.y + this.tweens.get('offset')
    this.sprite.opacity = this.tweens.get('opacity')
    this.sprite.draw()
  }
}