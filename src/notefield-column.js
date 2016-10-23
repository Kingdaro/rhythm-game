import * as canvas from './canvas'
import {tail, lerp} from './util'
import {JudgeLevels, getJudgement, isMissed} from './judgement'

export const columnWidth = 50

const keyHeight = 100
const keyBorderWidth = 5

const receptorHeight = 24

const noteHeight = receptorHeight
const noteSpacing = 100 // pixels per second

export function NotefieldColumn (color, columnPosition, scrollSpeed) {
  // private
  let pressed = false
  let brightness = 0
  const notes = []

  // public
  const receptorPosition = {
    x: columnPosition + columnWidth / 2,
    y: canvas.height - keyHeight
  }

  function addNote ({ time, column, length }) {
    notes.push({
      time, column, length,
      judgement: null, held: false
    })
  }

  function press (songTime) {
    for (const note of notes) {
      const judge = getJudgement(songTime - note.time)
      if (judge !== JudgeLevels.break) {
        note.judgement = judge
        note.held = note.length > 0
        break
      }
    }
    pressed = true
  }

  function lift (songTime) {
    for (const note of notes) {
      if (note.held && songTime < note.time + note.length - JudgeLevels.good.window) {
        note.judgement = JudgeLevels.break
        break
      }
    }
    pressed = false
  }

  function update (elapsed) {
    updateBrightness(elapsed)
  }

  function updateBrightness (elapsed) {
    if (pressed) {
      brightness = 1
    } else {
      brightness = lerp(brightness, 0, elapsed * 20)
    }
  }

  function draw (songTime) {
    canvas.batch(() => {
      canvas.translate(columnPosition, 0)
      drawBacklight(color, brightness)
      drawReceptor(color, brightness)
      notes.forEach(note => drawNote(note, color, songTime, scrollSpeed))
      drawKey(color, brightness)
    })
  }

  return {
    addNote,
    receptorPosition,
    update,
    draw,
    press,
    lift
  }
}

function drawReceptor (color, brightness) {
  const opacity = lerp(0.3, 0.6, brightness)
  canvas.setFillColor(color.opacity(opacity))
  canvas.fillRect(0, canvas.height - keyHeight, columnWidth, -receptorHeight)
}

function drawBacklight (color, brightness) {
  const opacity = lerp(0.03, 0.15, brightness)
  canvas.setFillColor(color.opacity(opacity))
  canvas.fillRect(0, 0, columnWidth, canvas.height)
}

function drawKey (color, brightness) {
  const dim = lerp(0.3, 0, brightness)

  canvas.batch(() => {
    canvas.translate(0, canvas.height)

    canvas.setFillColor(color.darken(dim))
    canvas.fillRect(0, 0, columnWidth, -keyHeight)

    canvas.setStroke(color.darken(dim + 0.2), keyBorderWidth)
    canvas.translate(keyBorderWidth / 2, -keyBorderWidth / 2)
    canvas.strokeRect(0, 0, columnWidth - keyBorderWidth, -keyHeight + keyBorderWidth)
  })
}

function drawNote ({ time, column, length, judgement }, color, songTime, scrollSpeed) {
  const y = canvas.height - keyHeight - (time - songTime) * noteSpacing * scrollSpeed

  if (judgement === JudgeLevels.break) {
    color = color.darken(0.3)
  }

  if (length > 0) {
    canvas.setFillColor(color.opacity(0.5))
    canvas.fillRect(0, y - noteHeight / 2, columnWidth, -length * noteSpacing * scrollSpeed)
  }

  canvas.setFillColor(color)
  canvas.fillRect(0, y, columnWidth, -noteHeight)
}
