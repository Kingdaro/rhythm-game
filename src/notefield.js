import {
  Scene,
  Translate,
  FillColor,
  FillRect,
  StrokeStyle,
  StrokeRect
} from './rendering'

import {NoteExplosion} from './note-explosion'
import {Judgement, JudgeLevels} from './judgement'
import {rgba} from './color'
import {lerp, range} from './util'

const columnWidth = 50
const position = 220
const borderWidth = 4
const dividerWidth = 2
const keyHeight = 100
const keyBorderWidth = 5
const receptorHeight = 24
const noteHeight = receptorHeight
const noteSpacing = 100 // pixels per second

const backgroundColor = rgba(0, 0, 0, 0.9)
const borderColor = rgba(255, 255, 255, 0.8)
const dividerColor = rgba(255, 255, 255, 0.1)

export function Notefield (params) {
  const {
    keyColors,
    scrollSpeed = 1,
    height: fieldHeight,
    columns: columnCount,
    notes: noteData
  } = params

  const notes = noteData.map(createNote)
  const columns = keyColors.map(createColumn)
  const explosion = NoteExplosion()
  const judgement = Judgement()

  let songTime = -2

  function createNote ({ time, column }) {
    return { time, column, judgement: 'none' }
  }

  function createColumn (color) {
    return { color, pressed: false, brightness: 0 }
  }

  function update (elapsed) {
    songTime += elapsed

    columns.forEach((col, i) => {
      if (col.pressed) {
        col.brightness = 1
      } else {
        col.brightness = lerp(col.brightness, 0, elapsed * 20)
      }
    })

    explosion.update(elapsed)
    judgement.update(elapsed)
  }

  function press (column) {
    columns[column].pressed = true

    for (const i in notes) {
      const note = notes[i]
      if (note.column === column) {
        const timing = Math.abs(note.time - songTime)
        const level = judgement.judgeTap(timing)
        if (level !== JudgeLevels.break) {
          notes.splice(i, 1)
          explosion.trigger((column + 0.5) * columnWidth, fieldHeight - keyHeight)
          judgement.trigger(level)
          break
        }
      }
    }
  }

  function lift (column) {
    columns[column].pressed = false
  }

  function render () {
    const fieldWidth = columnWidth * columnCount
    return Scene(
      // origin at notefield position
      Translate(position, 0),

      // background shade
      Scene(
        FillColor(backgroundColor),
        FillRect(0, 0, fieldWidth, fieldHeight),
      ),

      // column dividers
      Scene(
        FillColor(dividerColor),
        ...range(1, columnCount - 1).map(renderColumnDivider),
      ),

      // notefield edges
      Scene(
        FillColor(borderColor),
        Translate(-borderWidth, 0),
        FillRect(0, 0, borderWidth, fieldHeight),
        Translate(fieldWidth + borderWidth, 0),
        FillRect(0, 0, borderWidth, fieldHeight),
      ),

      // backlights
      Scene(...columns.map(renderBacklight)),

      // receptors
      Scene(
        Translate(0, fieldHeight - keyHeight - receptorHeight),
        ...columns.map(renderReceptor),
      ),

      // notes
      Scene(
        Translate(0, fieldHeight - keyHeight - receptorHeight),
        ...notes.map(renderNote),
      ),

      // keys
      Scene(
        Translate(0, fieldHeight - keyHeight),
        ...columns.map(renderKey),
      ),

      // note explosions
      explosion.render(),

      // judgement
      Scene(
        Translate(fieldWidth / 2, fieldHeight / 2 + 100),
        judgement.render(),
      ),
    )
  }

  function renderColumnDivider (col) {
    const x = columnWidth * col - dividerWidth / 2
    return FillRect(x, 0, dividerWidth, fieldHeight)
  }

  function renderReceptor ({ color, brightness }, index) {
    const opacity = lerp(0.3, 0.6, brightness)
    return Scene(
      FillColor(color.opacity(opacity).toString()),
      FillRect(index * columnWidth, 0, columnWidth, receptorHeight),
    )
  }

  function renderBacklight ({ color, brightness }, index) {
    const opacity = lerp(0.03, 0.15, brightness)
    return Scene(
      FillColor(color.opacity(opacity).toString()),
      FillRect(index * columnWidth, 0, columnWidth, fieldHeight)
    )
  }

  function renderNote ({ time, column }) {
    const x = column * columnWidth
    const y = (time - songTime) * noteSpacing * scrollSpeed
    return Scene(
      FillColor(columns[column].color),
      FillRect(x, -y, columnWidth, noteHeight),
    )
  }

  function renderKey ({ color, brightness }, index) {
    const dim = lerp(0.3, 0, brightness)
    return Scene(
      // rectangle body
      FillColor(color.darken(dim)),
      FillRect(columnWidth * index, 0, columnWidth, keyHeight),

      // darkened edge
      StrokeStyle(color.darken(dim + 0.2), keyBorderWidth),
      StrokeRect(columnWidth * index + keyBorderWidth / 2, keyBorderWidth / 2,
        columnWidth - keyBorderWidth, keyHeight - keyBorderWidth)
    )
  }

  return { update, render, press, lift }
}
