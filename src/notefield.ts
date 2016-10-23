import * as canvas from './canvas'
import NoteExplosion from './note-explosion'
import JudgementAnimation from './judgement'
// import Clock from './clock'
import {White, Black, Gold, Cloudy, Violet} from './color'

// import { NotefieldColumn, columnWidth } from './notefield-column'

const columnCount = 6
const columnWidth = 50
const notefieldPosition = 220
const borderWidth = 4

const backgroundColor = Black.opacity(0.9)
const borderColor = White.opacity(0.8)

const columnColors = [Gold, Cloudy, Violet, Cloudy, Violet, Cloudy]

interface Song {}

interface NotefieldConfig {}

class Notefield {
  explosion = new NoteExplosion()
  judgement = new JudgementAnimation()
  // columns = []

  constructor (private song: Song, private config: NotefieldConfig) {}

  update (elapsed: number) {}

  draw () {
    const fieldWidth = columnCount * columnWidth

    canvas.batch(() => {
      // start at notefield position
      canvas.translate(notefieldPosition, 0)

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

      // note explosions
      this.explosion.draw()

      // judgement
      this.judgement.draw()
    })
  }
}

export default Notefield
