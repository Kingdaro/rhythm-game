import * as canvas from './canvas'
import * as util from './util'
import {Cloudy} from './color'
import {TextSprite} from './text-sprite'
import {TweenValue} from './tween'

export class ComboAnimation {
  sprite = new TextSprite()
  bounce = new TweenValue(0.7, 1, 0.18)
  combo = 0

  constructor (public x = 0, public y = 0) {
    this.sprite.x = () => this.x
    this.sprite.y = () => this.y
    this.sprite.text = () => this.combo.toString()
    this.sprite.color = () => Cloudy
    this.sprite.scale = () => this.bounce.value
    this.sprite.fontSize = () => 72
  }

  add (combo: number) {
    if (combo > 0) {
      this.combo += combo
      this.bounce.reset()
    }
  }

  reset () {
    this.combo = 0
  }

  update (dt: number) {
    this.bounce.update(dt)
  }

  draw () {
    if (this.combo < 1) return
    this.sprite.draw()
  }
}
