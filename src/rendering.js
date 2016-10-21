const TAU = Math.PI * 2

// scene container
export function Scene (...children) {
  return function draw (ctx) {
    ctx.save()
    children.forEach(draw => draw(ctx))
    ctx.restore()
  }
}

// components
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

export function FillText (text, x, y) {
  return function draw (ctx) {
    ctx.fillText(text, x, y)
  }
}

// graphics state
export function FillColor (color) {
  return function draw (ctx) {
    ctx.fillStyle = color.toString()
  }
}

export function StrokeStyle (color, width) {
  return function draw (ctx) {
    ctx.strokeStyle = color.toString()
    ctx.lineWidth = width
  }
}

export function Shadow (ox, oy, blur, color) {
  return function draw (ctx) {
    ctx.shadowOffsetX = ox
    ctx.shadowOffsetY = oy
    ctx.shadowBlur = blur
    ctx.shadowColor = color.toString()
  }
}

export function Font (font) {
  return function draw (ctx) {
    ctx.font = font
  }
}

export function TextAlign (align) {
  return function draw (ctx)  {
    ctx.textAlign = align
  }
}

// transformations
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
