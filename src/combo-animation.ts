import * as canvas from './canvas'
import * as util from './util'
import {Cloudy} from './color'
import {TextSprite} from './text-sprite'
import {TweenValue} from './tween'

export class ComboAnimation {
  sprite = new TextSprite()
  scale = new TweenValue(0.7, 1, 0.3)
  combo = 0

  constructor (public x = 0, public y = 0) {
    this.sprite.color = Cloudy
    this.sprite.fontSize = 72
  }

  add (combo: number) {
    if (combo > 0) {
      this.combo += combo
      this.scale.reset()
    }
  }

  reset () {
    this.combo = 0
  }

  update (dt: number) {
    this.scale.update(dt)
    this.sprite.scale = this.scale.value
  }

  draw () {
    // if (this.combo < 1) return
    this.sprite.x = this.x
    this.sprite.y = this.y
    this.sprite.text = this.combo.toString()
    this.sprite.draw()
  }
}
