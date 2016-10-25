import * as canvas from './canvas'
import {Color, White} from './color'
import {TweenValue} from './tween'

export class TextSprite {
  public text = () => ''
  public x = () => 0
  public y = () => 0
  public color = () => White
  public font = () => 'Unica One'
  public fontSize = () => 32
  public align = () => 'center'
  public opacity = () => 1
  public scale = () => 1

  private tweens: { [property: string]: TweenValue } = {}

  tween (property: string, tween: TweenValue) {
    this.tweens[property] = tween
    this[property] = () => tween.value
  }

  update (dt: number) {
    for (const prop in this.tweens) {
      this.tweens[prop].update(dt)
    }
  }

  draw () {
    canvas.layer(() => {
      canvas.translate(this.x(), this.y())
      canvas.scale(this.scale())
      canvas.setFillColor(this.color().opacity(this.opacity()))
      canvas.setFont(`${this.fontSize()}px ${this.font()}`)
      canvas.setTextAlign(this.align())
      canvas.fillText(this.text(), 0, 0)
    })
  }
}
