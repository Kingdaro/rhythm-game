import {Background} from './background'
import {Notefield} from './notefield'
import {Scene} from './scene'
import {Timer} from './timer'
import {rgb} from './color'
import {clear} from './drawutils'

const gold = rgb(241, 196, 15)
const white = rgb(236, 240, 241)
const violet = rgb(155, 89, 182)

const bindings = [
  'KeyS',
  'KeyD',
  'KeyF',
  'KeyJ',
  'KeyK',
  'KeyL',
]

export function Game (ctx) {
  const {width, height} = ctx.canvas

  const timer = Timer()

  const field = Notefield({
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
  })

  const bg = Background(width, height)

  function step () {
    const elapsed = timer.step()
    bg.update(elapsed)
    field.update(elapsed)

    clear(ctx)
    bg.draw(ctx)
    field.draw(ctx)
  }

  function keydown (event) {
    const index = bindings.indexOf(event.code)
    if (index > -1) field.press(index)
  }

  function keyup (event) {
    const index = bindings.indexOf(event.code)
    if (index > -1) field.lift(index)
  }

  return { step, keydown, keyup }
}
