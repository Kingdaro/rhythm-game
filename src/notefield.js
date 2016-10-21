import {rgba} from './color'
import {lerp} from './util'

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
const keyBorderColor = rgba(0, 0, 0, 0.2)

export function Notefield (params) {
  const {
    height: fieldHeight,
    columns: columnCount,
    keyColors,
    notes: noteData,
  } = params

  const columns = keyColors.map(color => {
    return { color, pressed: false, brightness: 0 }
  })

  const notes = noteData.map(note => {
    return {
      time: note.time,
      column: note.column,
      x: note.column * columnWidth,
      y: note.time * noteSpacing,
      judgement: 'none',
    }
  })

  function update (elapsed) {
    columns.forEach((col, i) => {
      if (col.pressed) {
        col.brightness = 1
      } else {
        col.brightness = lerp(col.brightness, 0, elapsed * 20)
      }
    })
  }

  function press (column) {
    columns[column].pressed = true
  }

  function lift (column) {
    columns[column].pressed = false
  }

  function drawShade (ctx) {
    ctx.fillStyle = backgroundColor.toString()
    ctx.fillRect(0, 0, columnWidth * columnCount, fieldHeight)
  }

  function drawEdge (ctx) {
    ctx.fillStyle = borderColor.toString()
    ctx.fillRect(0, 0, borderWidth, fieldHeight)
  }

  function drawColumnDivider (ctx) {
    ctx.fillStyle = dividerColor.toString()
    ctx.fillRect(-dividerWidth / 2, 0, dividerWidth, fieldHeight)
  }

  function drawKey (ctx, color, brightness) {
    const dim = lerp(0.3, 0, brightness)
    ctx.fillStyle = color.darken(dim).toString()
    ctx.fillRect(0, 0, columnWidth, keyHeight)
    ctx.strokeStyle = color.darken(dim + 0.2).toString()
    ctx.lineWidth = keyBorderWidth
    ctx.strokeRect(keyBorderWidth / 2, keyBorderWidth / 2,
      columnWidth - keyBorderWidth, keyHeight - keyBorderWidth)
  }

  function drawReceptor (ctx, color, brightness) {
    const opacity = lerp(0.3, 0.6, brightness)
    ctx.fillStyle = color.opacity(opacity).toString()
    ctx.fillRect(0, 0, columnWidth, receptorHeight)
  }

  function drawBacklight (ctx, color, brightness) {
    const opacity = lerp(0.03, 0.15, brightness)
    ctx.fillStyle = color.opacity(opacity).toString()
    ctx.fillRect(0, 0, columnWidth, fieldHeight)
  }

  function draw (ctx) {
    const width = columnWidth * columnCount

    function transform (drawops) {
      ctx.save()
      drawops()
      ctx.restore()
    }

    transform(() => {
      // background shade
      ctx.translate(position, 0)
      drawShade(ctx)

      // column dividers
      transform(() => {
        for (let i = 1; i < columnCount; i++) {
          ctx.translate(columnWidth, 0)
          drawColumnDivider(ctx)
        }
      })

      // notefield edges
      transform(() => {
        ctx.translate(-borderWidth, 0)
        drawEdge(ctx)
        ctx.translate(width + borderWidth, 0)
        drawEdge(ctx)
      })

      // backlight
      transform(() => {
        columns.forEach(col => {
          drawBacklight(ctx, col.color, col.brightness)
          ctx.translate(columnWidth, 0)
        })
      })

      // receptor
      transform(() => {
        ctx.translate(0, fieldHeight - keyHeight - receptorHeight)
        columns.forEach(col => {
          drawReceptor(ctx, col.color, col.brightness)
          ctx.translate(columnWidth, 0)
        })
      })

      // notes
      transform(() => {
        ctx.translate(0, fieldHeight - keyHeight - receptorHeight)
        notes.forEach(note => {
          ctx.fillStyle = columns[note.column].color.toString()
          ctx.fillRect(note.x, -note.y, columnWidth, noteHeight)
        })
      })

      // keys
      transform(() => {
        ctx.translate(0, fieldHeight - keyHeight)
        columns.forEach(col => {
          drawKey(ctx, col.color, col.brightness)
          ctx.translate(columnWidth, 0)
        })
      })
    })
  }

  return { update, draw, press, lift }
}
