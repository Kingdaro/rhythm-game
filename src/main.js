import {Game} from './game'

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')
const game = Game(ctx)

window.requestAnimationFrame(function draw () {
  game.step()
  window.requestAnimationFrame(draw)
})

document.addEventListener('keydown', event => {
  game.keydown(event)
})

document.addEventListener('keyup', event => {
  game.keyup(event)
})
