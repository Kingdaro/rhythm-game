import {Background} from './background'
import {Notefield} from './notefield'
import {Scene} from './scene'
import {clear} from './drawutils'

export function Game (ctx) {
  const scene = Scene([
    Background(ctx),
    Notefield(ctx),
  ])

  let time = 0

  function update (elapsed) {
    time += elapsed
    scene.update(elapsed)
  }

  function draw () {
    clear(ctx)
    scene.draw()
  }

  return { update, draw }
}
