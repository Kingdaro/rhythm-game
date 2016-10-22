import {Game} from './game'
import {Gameplay} from './gameplay'

const game = Game()

game.setState(Gameplay)

window.requestAnimationFrame(function frame () {
  game.update()
  game.draw()
  window.requestAnimationFrame(frame)
})

window.addEventListener('keydown', game.keydown)
window.addEventListener('keyup', game.keyup)
