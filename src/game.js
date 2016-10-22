import {Background} from './background'
import {Notefield} from './notefield'
import {Timer} from './timer'
import {Scene} from './rendering'
import {Gold, Cloudy, Violet} from './color'

const bindings = [
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyK',
  'KeyL',
  'Semicolon'
]

export function clear (ctx) {
  const {width, height} = ctx.canvas
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
}

export function Game (ctx) {
  const {width, height} = ctx.canvas

  const timer = Timer()

  const field = Notefield({
    height,
    notes: [
      { column: 0, time: 0 },
      { column: 1, time: 1 },
      { column: 2, time: 2 },
      { column: 3, time: 3 },
      { column: 4, time: 4 },
      { column: 5, time: 5 }
    ],
    columns: 6,
    keyColors: [ Gold, Cloudy, Violet, Cloudy, Violet, Cloudy ],
    scrollSpeed: 3
  })

  const bg = Background(width, height)

  function step () {
    const elapsed = timer.step()
    bg.update(elapsed)
    field.update(elapsed)

    const draw = Scene(
      bg.render(),
      field.render(),
    )

    clear(ctx)
    draw(ctx)
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
