const columnWidth = 48
const position = 220
const borderWidth = 4
const dividerWidth = 1
const keyHeight = 100
const keyBorderWidth = 4

const backgroundColor = 'rgba(0, 0, 0, 0.8)'
const borderColor = 'rgba(255, 255, 255, 0.8)'
const dividerColor = 'rgba(255, 255, 255, 0.1)'
const keyBorderColor = 'rgba(0, 0, 0, 0.2)'

export function Notefield (params) {
  const {
    height: fieldHeight,
    columns: columnCount,
    keyColors,
    notes,
  } = params

  function update (elapsed) {}

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

      // keys
      transform(() => {
        ctx.translate(0, fieldHeight - keyHeight)
        keyColors.forEach(color => {
          drawKey(ctx, color)
          ctx.translate(columnWidth, 0)
        })
      })
    })
  }

  function drawShade (ctx) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, columnWidth * columnCount, fieldHeight)
  }

  function drawEdge (ctx) {
    ctx.fillStyle = borderColor
    ctx.fillRect(0, 0, borderWidth, fieldHeight)
  }

  function drawColumnDivider (ctx) {
    ctx.fillStyle = dividerColor
    ctx.fillRect(0, 0, dividerWidth, fieldHeight)
  }

  function drawKey (ctx, color) {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, columnWidth, keyHeight)
    ctx.strokeStyle = keyBorderColor
    ctx.lineWidth = keyBorderWidth
    ctx.strokeRect(keyBorderWidth / 2, keyBorderWidth / 2,
      columnWidth - keyBorderWidth, keyHeight - keyBorderWidth)
  }

  return { update, draw }
}
