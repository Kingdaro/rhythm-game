import {Timer} from './timer'

export function Game (initialState) {
  const timer = Timer()
  let state = initialState

  function update () {
    const elapsed = timer.step()
    state.update(elapsed)

    const newState = state.getNewState()
    if (newState) {
      state.leave()
      newState.enter()
      state = newState
    }
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

  state.enter()

  return { update, draw, keydown, keyup }
}

export function Gamestate (methods) {
  return {
    enter () {},
    leave () {},
    update () {},
    draw () {},
    keydown () {},
    keyup () {},
    getNewState () {},
    ...methods
  }
}
