const backgroundColor = 'rgba(0, 0, 0, 0.8)'
const borderColor = 'rgba(255, 255, 255, 0.8)'
const dividerColor = 'rgba(255, 255, 255, 0.1)'

const columnWidth = 48
const columnCount = 6
const position = 220
const borderWidth = 4
const dividerWidth = 1

export function Notefield (fieldHeight) {

  function update (elapsed) {}

  function drawShade (ctx) {
    ctx.fillRect(0, 0, columnWidth * columnCount, fieldHeight)
  }

  function drawEdge (ctx) {
    ctx.fillRect(0, 0, borderWidth, fieldHeight)
  }

  function drawColumnDivider (ctx) {
    ctx.fillRect(0, 0, dividerWidth, fieldHeight)
  }

  function draw (ctx) {
    const width = columnWidth * columnCount

    ctx.save()

    ctx.fillStyle = backgroundColor
    ctx.translate(position, 0)
    drawShade(ctx)

    ctx.fillStyle = borderColor

    ctx.save()
    ctx.translate(-borderWidth / 2, 0)
    drawEdge(ctx)
    ctx.translate(width, 0)
    drawEdge(ctx)
    ctx.restore()

    ctx.fillStyle = dividerColor
    for (let i = 1; i < columnCount; i++) {
      ctx.translate(columnWidth, 0)
      drawColumnDivider(ctx)
    }

    ctx.restore()
  }

  return { update, draw }
}
