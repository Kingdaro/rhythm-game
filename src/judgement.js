import {Scene, Font, TextAlign, FillText, FillColor} from './rendering'
import {lerp, clamp} from './util'
import {rgb, White} from './color'

export const JudgeLevels = {
  absolute: { text: 'ABSOLUTE', color: rgb(231, 76, 60), window: 0.03 },
  perfect: { text: 'PERFECT', color: rgb(231, 76, 60), window: 0.1 },
  good: { text: 'GOOD', color: rgb(231, 76, 60), window: 0.2 },
  break: { text: 'BREAK', color: rgb(231, 76, 60) },
}

export function Judgement () {
  let visualOffset = 0
  let opacity = 0
  let lastJudgement

  function update (elapsed) {
    visualOffset = lerp(visualOffset, 0, elapsed * 10)
    opacity -= elapsed * 5
  }

  function render () {
    if (lastJudgement != null) {
      const {text, color} = lastJudgement
      return Scene(
        FillColor(color.opacity(clamp(opacity, 0, 1))),
        Font('40pt Unica One'),
        TextAlign('center'),
        FillText(text, 0, visualOffset * 20),
      )
    } else {
      return Scene()
    }
  }

  function trigger (score) {
    visualOffset = 1
    opacity = 4
    lastJudgement = score
  }

  function judgeTap (timing) {
    if (timing < JudgeLevels.absolute.window) return JudgeLevels.absolute
    if (timing < JudgeLevels.perfect.window) return JudgeLevels.perfect
    if (timing < JudgeLevels.good.window) return JudgeLevels.good
    return JudgeLevels.break
  }

  return { update, render, trigger, judgeTap }
}
