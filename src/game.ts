import Background from './background'
import Timer from './timer'
import Gameplay from './gameplay'

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
    this.bg.draw()
    this.gameplay.draw()
  }
}
