import { NoteExplosion } from './note-explosion'
import { Judgement, JudgeLevels } from './judgement'
import { NotefieldColumn, columnWidth } from './notefield-column'
import { White, Black, Gold, Cloudy, Violet } from './color'
import * as canvas from './canvas'

const columnCount = 6
const position = 220
const borderWidth = 4

const backgroundColor = Black.opacity(0.9)
const borderColor = White.opacity(0.8)

const columnColors = [ Gold, Cloudy, Violet, Cloudy, Violet, Cloudy ]

export function Notefield (song, config) {
  const { scrollSpeed } = config

  const explosion = NoteExplosion()
  const judgement = Judgement()

  const columns = []

  let songTime = -2

  for (let i = 0; i < columnCount; i++) {
    columns.push(NotefieldColumn(columnColors[i], i * columnWidth, scrollSpeed))
  }

  for (const note of song.notes) {
    const { time, column } = note
    columns[column].addNote(time, column)
  }

  function checkTap (column) {
    const level = column.checkTap(songTime)
    if (level && level !== JudgeLevels.break) {
      const { x, y } = column.receptorPosition
      explosion.trigger(x, y)
      judgement.trigger(level)
    }
  }

  function checkMiss (column) {
    if (column.checkMiss(songTime)) {
      judgement.trigger(JudgeLevels.break)
    }
  }

  function press (columnIndex) {
    const column = columns[columnIndex]
    column.press()
    checkTap(column)
  }

  function lift (columnIndex) {
    const column = columns[columnIndex]
    column.lift()
  }

  function update (elapsed) {
    songTime += elapsed

    columns.forEach(column => {
      column.updateBrightness(elapsed)
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
        canvas.fillRect(0, 0, fieldWidth, canvas.height)
      })

      // notefield edges
      canvas.batch(() => {
        canvas.setFillColor(borderColor)
        canvas.translate(-borderWidth, 0)
        canvas.fillRect(0, 0, borderWidth, canvas.height)
        canvas.translate(fieldWidth + borderWidth, 0)
        canvas.fillRect(0, 0, borderWidth, canvas.height)
      })

      // columns
      columns.forEach(col => col.draw(songTime))

      // note explosions
      explosion.draw()

      // judgement
      canvas.batch(() => {
        canvas.translate(fieldWidth / 2, canvas.height / 2 + 100)
        judgement.draw()
      })
    })
  }

  return { update, draw, press, lift }
}
