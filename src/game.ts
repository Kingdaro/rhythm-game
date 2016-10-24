import {Background} from './background'
import {Timer} from './timer'
import {Gameplay} from './gameplay'
import {clear} from './canvas'
import {White} from './color'

export class Game {
  bg = new Background()
  timer = new Timer()
  gameplay = new Gameplay()

  update () {
    const dt = this.timer.step()
    this.bg.update(dt)
    this.gameplay.update(dt)
  }

  draw () {
    clear(White)
    this.bg.draw()
    this.gameplay.draw()
  }
}
