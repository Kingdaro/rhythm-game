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
  [Judgement.None]: new Color(0, 0, 0, 0),
}

const JudgementText = {
  [Judgement.Absolute]: 'ABSOLUTE',
  [Judgement.Perfect]: 'PERFECT',
  [Judgement.Good]: 'GOOD',
  [Judgement.Break]: 'BREAK',
  [Judgement.None]: ''
}

export class JudgementAnimation {
  sprite = new TextSprite()
  judgement = Judgement.None

  bounce = new TweenValue()
  fade = new TweenValue()

  bounceBreak = new TweenValue(this.y, this.y + 20, 1, 0, Linear)
  fadeBreak =  new TweenValue(1, 0, 0.5, 0.5)

  constructor (public x = 0, public y = 0) {
    this.sprite.x = () => this.x
    this.sprite.y = () => this.bounce.value
    this.sprite.opacity = () => this.fade.value
    this.sprite.fontSize = () => 60
    this.sprite.text = () => JudgementText[this.judgement]
    this.sprite.color = () => JudgementColor[this.judgement]
  }

  play (judgement: Judgement) {
    this.judgement = judgement
    if (judgement !== Judgement.Break) {
      this.bounce = new TweenValue(this.y + 20, this.y, 0.3)
      this.fade = new TweenValue(1, 0, 0.3, 0.7)
    } else {
      this.bounce = new TweenValue(this.y, this.y + 20, 1, 0, Linear)
      this.fade = new TweenValue(1, 0, 0.5, 0.5)
    }
  }

  update (dt: number) {
    this.bounce.update(dt)
    this.fade.update(dt)
  }

  draw () {
    this.sprite.draw()
  }
}