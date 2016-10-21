import {Scene, Font, TextAlign, FillText, FillColor} from './rendering'
import {lerp, clamp} from './util'
import {rgb, White} from './color'

const judgements = [
  { text: 'BREAK', color: rgb(231, 76, 60) },
  { text: 'GOOD', color: rgb(46, 204, 113) },
  { text: 'PERFECT', color: rgb(241, 196, 15) },
  { text: 'ABSOLUTE', color: rgb(52, 152, 219) },
]

export function Judgement () {
  let visualOffset = 0
  let opacity = 0
  let lastJudgement = 3

  function update (elapsed) {
    visualOffset = lerp(visualOffset, 0, elapsed * 10)
    opacity -= elapsed * 5
  }

  function render () {
    const {text, color} = judgements[lastJudgement]
    return Scene(
      FillColor(color.opacity(clamp(opacity, 0, 1))),
      Font('40pt Unica One'),
      TextAlign('center'),
      FillText(text, 0, visualOffset * 20),
    )
  }

  function trigger (score) {
    visualOffset = 1
    opacity = 4
    lastJudgement = score
  }

  function judgeTap (timing) {
    if (timing <= 0.03) {
      return 3
    } else if (timing <= 0.1) {
      return 2
    } else if (timing <= 0.2) {
      return 1
    }
    return 0
  }

  return { update, render, trigger, judgeTap }
}
