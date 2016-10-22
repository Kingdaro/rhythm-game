import {Timer} from './timer'

export function Game () {
  const timer = Timer()
  let state = Gamestate()

  function update () {
    const elapsed = timer.step()
    state.update(elapsed)
  }

  function draw () {
    state.draw()
  }

  function keydown (event) {
    state.keydown(event)
  }

  function keyup (event) {
    state.keyup(event)
  }

  function setState (newStateConstructor) {
    state = newStateConstructor({ setState })
  }

  return { update, draw, keydown, keyup, setState }
}

export function Gamestate (methods = {}) {
  return {
    update () {},
    draw () {},
    keydown () {},
    keyup () {},
    ...methods
  }
}
