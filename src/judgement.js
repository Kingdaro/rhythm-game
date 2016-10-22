import * as canvas from './canvas'
import {clamp} from './util'
import {Blue, Orange, Green, Red} from './color'

export const JudgeLevels = {
  absolute: { text: 'ABSOLUTE', color: Blue, window: 15 / 1000 },
  perfect: { text: 'PERFECT', color: Orange, window: 70 / 1000 },
  good: { text: 'GOOD', color: Green, window: 130 / 1000 },
  break: { text: 'BREAK', color: Red }
}

export function Judgement () {
  let animation = 1
  let lastJudgement

  function trigger (score) {
    animation = 1
    lastJudgement = score
  }

  function update (elapsed) {
    animation = clamp(animation - (elapsed / 0.8), 0, 1)
  }

  function draw () {
    if (lastJudgement != null) {
      let opacity, offset
      if (lastJudgement !== JudgeLevels.break) {
        opacity = clamp(animation * 5, 0, 1)
        offset = (animation ** 8) * 20
      } else {
        opacity = clamp(animation * 2, 0, 1)
        offset = (1 - animation) * 20
      }
      drawJudgement(lastJudgement, opacity, offset)
    }
  }

  function drawJudgement ({ text, color }, opacity, offset) {
    canvas.batch(() => {
      canvas.setFillColor(color.opacity(opacity))
      canvas.setFont('40pt Unica One')
      canvas.setTextAlign('center')
      canvas.fillText(text, 0, offset)
    })
  }

  return { update, draw, trigger }
}

export function getJudgement (timing) {
  const diff = Math.abs(timing)
  if (diff < JudgeLevels.absolute.window) return JudgeLevels.absolute
  if (diff < JudgeLevels.perfect.window) return JudgeLevels.perfect
  if (diff < JudgeLevels.good.window) return JudgeLevels.good
  return JudgeLevels.break
}

export function isMissed (timing) {
  return timing > JudgeLevels.good.window
}
