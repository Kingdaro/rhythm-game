import { degrees } from './util'

const { cos, sin, PI } = Math
const TAU = PI * 2

export const element = document.querySelector('#game')
export const ctx = element.getContext('2d')

export const width = element.width
export const height = element.height

// drawing
export function circle (x, y, radius, sides = 0) {
  ctx.beginPath()
  if (sides > 0) {
    for (let i = 0; i < sides; i++) {
      const theta = i / sides * TAU
      const ox = x + cos(theta) * radius
      const oy = y + sin(theta) * radius
      ctx.lineTo(ox, oy)
    }
  } else {
    ctx.arc(x, y, radius, 0, TAU)
  }
  ctx.fill()
}

export function fillRect (x, y, width, height) {
  ctx.fillRect(x, y, width, height)
}

export function strokeRect (x, y, width, height) {
  ctx.strokeRect(x, y, width, height)
}

export function fillText (text, x, y) {
  ctx.fillText(text, x, y)
}

export function clear (color) {
  ctx.fillStyle = color.toString()
  ctx.fillRect(0, 0, width, height)
}

// graphics state
export function setFillColor (color) {
  ctx.fillStyle = color.toString()
}

export function setStroke (color, width) {
  ctx.strokeStyle = color.toString()
  ctx.lineWidth = width
}

export function setStrokeColor (color) {
  ctx.strokeStyle = color.toString()
}

export function setShadow (ox, oy, blur, color) {
  ctx.shadowOffsetX = ox
  ctx.shadowOffsetY = oy
  ctx.shadowBlur = blur
  ctx.shadowColor = color.toString()
}

export function setFont (font) {
  ctx.font = font
}

export function setTextAlign (align) {
  ctx.textAlign = align
}

// transformation
export function batch (drawops, ...args) {
  ctx.save()
  drawops(...args)
  ctx.restore()
}

export function translate (x, y) {
  ctx.translate(x, y)
}

export function rotate (deg) {
  ctx.rotate(degrees(deg))
}
