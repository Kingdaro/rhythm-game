export function clear (ctx) {
  const {width, height} = ctx.canvas
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
}

export function triangle (ctx, x, y, radius) {
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, -radius)
  ctx.lineTo(radius * Math.sqrt(2), radius)
  ctx.lineTo(-radius * Math.sqrt(2), radius)
  ctx.fill()
  ctx.restore()
}
