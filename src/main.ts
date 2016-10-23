import {Game} from './game'

const game = new Game()

window.requestAnimationFrame(function frame () {
  game.update()
  game.draw()
  window.requestAnimationFrame(frame)
})

// window.addEventListener('keydown', event => game.keydown(event.code))
// window.addEventListener('keyup', event => game.keyup(event.code))
