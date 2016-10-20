import {Background} from './background'
import {Notefield} from './notefield'
import {Scene} from './scene'
import {Timer} from './timer'
import {clear} from './drawutils'

export function Game (ctx) {
  const {width, height} = ctx.canvas

  const timer = Timer()

  const scene = Scene([
    Background(width, height),
    Notefield(height),
  ])

  function step () {
    const elapsed = timer.step()
    scene.update(elapsed)
    clear(ctx)
    scene.draw(ctx)
  }

  return { step }
}
