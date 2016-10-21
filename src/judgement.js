import {Scene, Font, TextAlign, FillText, FillColor} from './rendering'
import {lerp, clamp} from './util'
import {White} from './color'

export function Judgement () {
  let visualOffset = 0
  let opacity = 0

  function update (elapsed) {
    visualOffset = lerp(visualOffset, 0, elapsed * 10)
    opacity -= elapsed * 5
  }

  function render () {
    return Scene(
      FillColor(White.opacity(clamp(opacity, 0, 1))),
      Font('40pt Unica One'),
      TextAlign('center'),
      FillText('ABSOLUTE', 0, visualOffset * 20),
    )
  }

  function trigger () {
    visualOffset = 1
    opacity = 4
  }

  return { update, render, trigger }
}
