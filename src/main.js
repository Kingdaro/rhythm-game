import {Game} from './game'
import {Gameplay} from './gameplay'

const game = Game(Gameplay())

window.requestAnimationFrame(function frame () {
  game.update()
  game.draw()
  window.requestAnimationFrame(frame)
})

window.addEventListener('keydown', event => {
  if (!event.repeat) game.keydown(event)
})

window.addEventListener('keyup', event => {
  if (!event.repeat) game.keyup(event)
})
