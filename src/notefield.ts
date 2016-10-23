import * as canvas from './canvas'
import {NoteExplosion} from './note-explosion'
import {JudgementAnimation} from './judgement'
import {Color, White, Black, Gold, Cloudy, Violet} from './color'
// import {Clock} from './clock'

const ColumnWidth = 48
const NotefieldPosition = 220
const BorderWidth = 4
const NoteHeight = 24
const NoteSpacing = 100
const KeyHeight = 96

const BackgroundColor = Black.opacity(0.9)
const BorderColor = White.opacity(0.8)

class Column {
  constructor (public color: Color) {}

  draw () {
    // backlight
    canvas.batch(() => {
      canvas.setFillColor(this.color.opacity(0.05))
      canvas.fillRect(0, 0, ColumnWidth, canvas.height)
    })

    // receptor
    canvas.batch(() => {
      canvas.setFillColor(this.color.opacity(0.3))
      canvas.fillRect(0, canvas.height - KeyHeight, ColumnWidth, -NoteHeight)
    })

    // key
    canvas.batch(() => {
      canvas.setFillColor(this.color)
      canvas.fillRect(0, canvas.height, ColumnWidth, -KeyHeight)
    })
  }
}

export class Notefield {
  explosion = new NoteExplosion()
  judgement = new JudgementAnimation()
  songTime = -3
  columns: Column[] = []

  constructor () {
    this.setColumns([Gold, Cloudy, Violet, Cloudy, Violet, Cloudy])
  }

  setColumns (colors: Color[]) {
    this.columns = colors.map(color => new Column(color))
  }

  update (elapsed: number) {
    this.songTime += elapsed
  }

  draw () {
    const fieldWidth = this.columns.length * ColumnWidth

    canvas.batch(() => {
      // start at notefield position
      canvas.translate(NotefieldPosition, 0)

      // background shade
      canvas.batch(() => {
        canvas.setFillColor(BackgroundColor)
        canvas.fillRect(0, 0, fieldWidth, canvas.height)
      })

      // notefield edges
      canvas.batch(() => {
        canvas.setFillColor(BorderColor)
        canvas.translate(-BorderWidth, 0)
        canvas.fillRect(0, 0, BorderWidth, canvas.height)
        canvas.translate(fieldWidth + BorderWidth, 0)
        canvas.fillRect(0, 0, BorderWidth, canvas.height)
      })

      // columns
      canvas.batch(() => {
        this.columns.forEach(column => {
          column.draw()
          canvas.translate(ColumnWidth, 0)
        })
      })
    })

    // note explosions
    this.explosion.draw()

    // judgement
    this.judgement.draw()
  }
}
