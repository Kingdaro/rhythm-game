import * as canvas from './canvas'
import { tail, lerp } from './util'
import { JudgeLevels, getJudgement, isMissed } from './judgement'

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
  let notes = []

  // public
  const receptorPosition = {
    x: columnPosition + columnWidth / 2,
    y: canvas.height - keyHeight
  }

  function addNote (time, column) {
    notes.push({ time, column })
  }

  function checkTap (songTime) {
    const currentNote = tail(notes)
    if (currentNote) {
      const timing = songTime - currentNote.time
      const level = getJudgement(timing)
      if (level !== JudgeLevels.break) {
        notes.pop()
      }
      return level
    }
  }

  function checkMiss (songTime) {
    const currentNote = tail(notes)
    if (currentNote && isMissed(songTime - currentNote.time)) {
      notes.pop()
      return true
    }
  }

  function press () {
    pressed = true
  }

  function lift () {
    pressed = false
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
    checkTap,
    checkMiss,
    updateBrightness,
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

function drawNote ({ time, column }, color, songTime, scrollSpeed) {
  const y = canvas.height - keyHeight - (time - songTime) * noteSpacing * scrollSpeed
  canvas.setFillColor(color)
  canvas.fillRect(0, y, columnWidth, -noteHeight)
}
