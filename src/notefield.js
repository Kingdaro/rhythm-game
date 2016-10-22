import { NoteExplosion } from './note-explosion'
import { Judgement, JudgeLevels, getJudgement, isMissed } from './judgement'
import { White, Black, Gold, Cloudy, Violet } from './color'
import { lerp, range, tail } from './util'
import * as canvas from './canvas'

const columnCount = 6
const columnWidth = 50
const position = 220
const borderWidth = 4
const dividerWidth = 2
const keyHeight = 100
const keyBorderWidth = 5
const receptorHeight = 24
const noteHeight = receptorHeight
const noteSpacing = 100 // pixels per second

const backgroundColor = Black.opacity(0.9)
const borderColor = White.opacity(0.8)
const dividerColor = White.opacity(0.1)

const columnColors = [ Gold, Cloudy, Violet, Cloudy, Violet, Cloudy ]

export function Notefield (song, config) {
  const { height: fieldHeight } = document.querySelector('#game')
  const { scrollSpeed } = config

  const explosion = NoteExplosion()
  const judgement = Judgement()

  const columns = range(0, columnCount - 1).map(n => {
    return {
      pressed: false,
      brightness: 0,
      color: columnColors[n],
      notes: []
    }
  })

  for (const note of song.notes) {
    const { time, column } = note
    columns[column].notes.push({ time, column, judgement: null })
  }

  let songTime = -2

  function getReceptorPosition (columnIndex) {
    return [ (columnIndex + 0.5) * columnWidth, fieldHeight - keyHeight ]
  }

  function checkTap (column) {
    const currentNote = tail(column.notes)
    if (currentNote) {
      const timing = songTime - currentNote.time
      const level = getJudgement(timing)
      if (level !== JudgeLevels.break) {
        column.notes.pop()
        judgement.trigger(level)
        return true
      }
    }
  }

  function checkMiss (column) {
    const currentNote = tail(column.notes)
    if (currentNote && isMissed(songTime - currentNote.time)) {
      column.notes.pop()
      judgement.trigger(JudgeLevels.break)
    }
  }

  function updateColumnBrightness (column, elapsed) {
    if (column.pressed) {
      column.brightness = 1
    } else {
      column.brightness = lerp(column.brightness, 0, elapsed * 20)
    }
  }

  function press (columnIndex) {
    const column = columns[columnIndex]
    if (checkTap(column)) {
      explosion.trigger(...getReceptorPosition(columnIndex))
    }
    column.pressed = true
  }

  function lift (columnIndex) {
    columns[columnIndex].pressed = false
  }

  function update (elapsed) {
    songTime += elapsed

    columns.forEach(column => {
      updateColumnBrightness(column, elapsed)
      checkMiss(column)
    })

    explosion.update(elapsed)
    judgement.update(elapsed)
  }

  function draw () {
    const fieldWidth = columnWidth * columnCount

    canvas.batch(() => {
      // origin at notefield position
      canvas.translate(position, 0)

      // background shade
      canvas.batch(() => {
        canvas.setFillColor(backgroundColor)
        canvas.fillRect(0, 0, fieldWidth, fieldHeight)
      })

      // column dividers
      canvas.batch(() => {
        canvas.setFillColor(dividerColor)
        for (let i = 1; i < columnCount; i++) {
          drawColumnDivider(i)
        }
      })

      // notefield edges
      canvas.batch(() => {
        canvas.setFillColor(borderColor)
        canvas.translate(-borderWidth, 0)
        canvas.fillRect(0, 0, borderWidth, fieldHeight)
        canvas.translate(fieldWidth + borderWidth)
        canvas.fillRect(0, 0, borderWidth, fieldHeight)
      })

      // backlights
      canvas.batch(() => {
        columns.forEach(drawBacklight)
      })

      // receptors
      canvas.batch(() => {
        canvas.translate(0, fieldHeight - keyHeight - receptorHeight)
        columns.forEach(drawReceptor)
      })

      // notes
      canvas.batch(() => {
        canvas.translate(0, fieldHeight - keyHeight - receptorHeight)
        for (const col of columns) {
          col.notes.map(drawNote)
        }
      })

      // keys
      canvas.batch(() => {
        canvas.translate(0, fieldHeight - keyHeight)
        columns.forEach(drawKey)
      })

      // note explosions
      explosion.draw()

      // judgement
      canvas.batch(() => {
        canvas.translate(fieldWidth / 2, fieldHeight / 2 + 100)
        judgement.draw()
      })
    })
  }

  function drawColumnDivider (col) {
    const x = columnWidth * col - dividerWidth / 2
    canvas.fillRect(x, 0, dividerWidth, fieldHeight)
  }

  function drawReceptor ({ color, brightness }, index) {
    const opacity = lerp(0.3, 0.6, brightness)
    canvas.setFillColor(color.opacity(opacity))
    canvas.fillRect(index * columnWidth, 0, columnWidth, receptorHeight)
  }

  function drawBacklight ({ color, brightness }, index) {
    const opacity = lerp(0.03, 0.15, brightness)
    canvas.setFillColor(color.opacity(opacity))
    canvas.fillRect(index * columnWidth, 0, columnWidth, fieldHeight)
  }

  function drawNote ({ time, column }) {
    const x = column * columnWidth
    const y = (time - songTime) * noteSpacing * scrollSpeed
    canvas.setFillColor(columns[column].color)
    canvas.fillRect(x, -y, columnWidth, noteHeight)
  }

  function drawKey ({ color, brightness }, index) {
    const dim = lerp(0.3, 0, brightness)
    canvas.setFillColor(color.darken(dim))
    canvas.fillRect(columnWidth * index, 0, columnWidth, keyHeight)

    canvas.setStroke(color.darken(dim + 0.2), keyBorderWidth)
    canvas.strokeRect(columnWidth * index + keyBorderWidth / 2, keyBorderWidth / 2,
      columnWidth - keyBorderWidth, keyHeight - keyBorderWidth)
  }

  return { update, draw, press, lift }
}
