import {Background} from './background'
import {Notefield} from './notefield'
import {Scene} from './scene'
import {Timer} from './timer'
import {rgb} from './color'
import {clear} from './drawutils'

const gold = rgb(241, 196, 15)
const white = rgb(236, 240, 241)
const violet = rgb(155, 89, 182)

export function Game (ctx) {
  const {width, height} = ctx.canvas

  const timer = Timer()

  const scene = Scene([
    Background(width, height),
    Notefield({
      height,
      notes: [],
      columns: 6,
      keyColors: [
        gold,
        white,
        violet,
        white,
        violet,
        white,
      ]
    }),
  ])

  function step () {
    const elapsed = timer.step()
    scene.update(elapsed)
    clear(ctx)
    scene.draw(ctx)
  }

  return { step }
}
