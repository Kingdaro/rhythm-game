import {
  Scene,
  Translate,
  FillColor,
  FillRect,
  StrokeStyle,
  StrokeRect
} from './rendering'

import {NoteExplosion} from './note-explosion'
import {Judgement, JudgeLevels, getJudgement, isMissed} from './judgement'
import {White, Black} from './color'
import {lerp, range, tail} from './util'

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

export function Notefield (params) {
  const {
    keyColors,
    scrollSpeed = 1,
    height: fieldHeight,
    columns: columnCount,
    notes: noteData
  } = params

  // const notes = noteData.map(createNote)
  const columns = keyColors.map(createColumn)
  const explosion = NoteExplosion()
  const judgement = Judgement()

  let songTime = -2

  function createNote ({ time, column }) {
    return { time, column, judgement: 'none' }
  }

  function createColumn (color, index) {
    const notes = noteData
      .filter(note => note.column === index)
      .map(createNote)
      .sort((a, b) => b.time - a.time)

    return { color, pressed: false, brightness: 0, notes }
  }

  function getReceptorPosition (columnIndex) {
    return [(columnIndex + 0.5) * columnWidth, fieldHeight - keyHeight]
  }

  function checkTap (column, columnIndex) {
    const currentNote = tail(column.notes)
    if (currentNote) {
      const timing = songTime - currentNote.time
      const level = getJudgement(timing)
      if (level !== JudgeLevels.break) {
        column.notes.pop()
        explosion.trigger(...getReceptorPosition(columnIndex))
        judgement.trigger(level)
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
    checkTap(column, columnIndex)
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
        ...columns.map(col => Scene(...col.notes.map(renderNote))),
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
