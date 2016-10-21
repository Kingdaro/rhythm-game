import {Game} from './game'

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')
const game = Game(ctx)

window.requestAnimationFrame(function draw () {
  game.step()
  window.requestAnimationFrame(draw)
})

window.addEventListener('keydown', event => {
  if (!event.repeat) game.keydown(event)
})

window.addEventListener('keyup', event => {
  if (!event.repeat) game.keyup(event)
})
