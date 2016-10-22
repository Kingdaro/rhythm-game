import {Game} from './game'
import {Gameplay} from './gameplay'

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')
const game = Game(Gameplay())

window.requestAnimationFrame(function frame () {
  game.update()
  game.draw(ctx)
  window.requestAnimationFrame(frame)
})

window.addEventListener('keydown', event => {
  if (!event.repeat) game.keydown(event)
})

window.addEventListener('keyup', event => {
  if (!event.repeat) game.keyup(event)
})
