import {rgba} from './color'
import {lerp} from './util'

const columnWidth = 50
const position = 220
const borderWidth = 4
const dividerWidth = 2
const keyHeight = 100
const keyBorderWidth = 5
const receptorHeight = 24

const backgroundColor = rgba(0, 0, 0, 0.9)
const borderColor = rgba(255, 255, 255, 0.8)
const dividerColor = rgba(255, 255, 255, 0.1)
const keyBorderColor = rgba(0, 0, 0, 0.2)

export function Notefield (params) {
  const {
    height: fieldHeight,
    columns: columnCount,
    keyColors,
    notes,
  } = params

  const columnInputs = Array(columnCount).fill(false)
  const columnBrightness = Array(columnCount).fill(0)

  function update (elapsed) {
    columnInputs.forEach((pressed, i) => {
      if (pressed) {
        columnBrightness[i] = 1
      } else {
        columnBrightness[i] = lerp(columnBrightness[i], 0, elapsed * 20)
      }
    })
  }

  function press (column) {
    columnInputs[column] = true
  }

  function lift (column) {
    columnInputs[column] = false
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
        keyColors.forEach((color, i) => {
          drawBacklight(ctx, color, columnBrightness[i])
          ctx.translate(columnWidth, 0)
        })
      })

      // keys
      transform(() => {
        ctx.translate(0, fieldHeight - keyHeight)
        keyColors.forEach((color, i) => {
          drawKey(ctx, color, columnBrightness[i])
          ctx.translate(columnWidth, 0)
        })
      })

      // receptor
      transform(() => {
        ctx.translate(0, fieldHeight - keyHeight - receptorHeight)
        keyColors.forEach((color, i) => {
          drawReceptor(ctx, color, columnBrightness[i])
          ctx.translate(columnWidth, 0)
        })
      })
    })
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

  return { update, draw, press, lift }
}
