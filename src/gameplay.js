import {Gamestate} from './game'
import {Background} from './background'
import {Notefield} from './notefield'
import {Scene} from './rendering'

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

export function Gameplay () {
  const {width, height} = document.querySelector('#game')

  const song = {
    title: 'random song',
    artist: 'random person',
    notes: [
      { column: 0, time: 0 },
      { column: 1, time: 1 },
      { column: 2, time: 2 },
      { column: 3, time: 3 },
      { column: 4, time: 4 },
      { column: 5, time: 5 }
    ]
  }

  const config = { scrollSpeed: 3 }

  const field = Notefield(song, config)
  const bg = Background(width, height)

  function update (elapsed) {
    bg.update(elapsed)
    field.update(elapsed)
  }

  function draw (ctx) {
    const rendered = Scene(bg.render(), field.render())
    clear(ctx)
    rendered(ctx)
  }

  function keydown (event) {
    const index = bindings.indexOf(event.code)
    if (index > -1) field.press(index)
  }

  function keyup (event) {
    const index = bindings.indexOf(event.code)
    if (index > -1) field.lift(index)
  }

  return Gamestate({ update, draw, keydown, keyup })
}
