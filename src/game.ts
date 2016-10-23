import Background from './background'
import Timer from './timer'
import Gameplay from './gameplay'
import {clear} from './canvas'
import {White} from './color'

export default class Game {
  bg = new Background()
  timer = new Timer()
  gameplay = new Gameplay()

  update () {
    const elapsed = this.timer.step()
    this.bg.update(elapsed)
    this.gameplay.update(elapsed)
  }

  draw () {
    clear(White)
    this.bg.draw()
    this.gameplay.draw()
  }
}
