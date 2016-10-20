import {Game} from './game'
import {Timer} from './timer'

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')
const game = Game(ctx)
const timer = Timer()

window.requestAnimationFrame(function draw () {
  const elapsed = timer.step()
  game.update(elapsed)
  game.draw()
  window.requestAnimationFrame(draw)
})
