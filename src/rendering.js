const TAU = Math.PI * 2

export function Scene (...children) {
  return function draw (ctx) {
    ctx.save()
    children.forEach(draw => draw(ctx))
    ctx.restore()
  }
}

export function FillColor (color) {
  return function draw (ctx) {
    ctx.fillStyle = color.toString()
  }
}

export function StrokeStyle (color, width) {
  return function draw (ctx) {
    ctx.strokeStyle = color.toString()
    if (width) ctx.lineWidth = width
  }
}

export function FillRect (x, y, width, height) {
  return function draw (ctx) {
    ctx.fillRect(x, y, width, height)
  }
}

export function StrokeRect(x, y, width, height) {
  return function draw (ctx) {
    ctx.strokeRect(x, y, width, height)
  }
}

export function FillCircle (x, y, radius, sides = 0) {
  return function draw (ctx) {
    ctx.beginPath()
    if (sides > 0) {
      for (let i = 0; i < sides; i++) {
        const theta = i / sides * TAU
        const ox = x + Math.cos(theta) * radius
        const oy = y + Math.sin(theta) * radius
        ctx.lineTo(ox, oy)
      }
    } else {
      ctx.arc(x, y, radius, 0, TAU)
    }
    ctx.fill()
  }
}

export function Translate (x, y) {
  return function draw (ctx) {
    ctx.translate(x, y)
  }
}

export function RotateDegrees (degrees) {
  const rads = degrees / 360 * TAU
  return function draw (ctx) {
    ctx.rotate(rads)
  }
}
