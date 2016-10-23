import * as canvas from './canvas'
import {NoteExplosion} from './note-explosion'
import {JudgementAnimation} from './judgement'
import {Color, White, Black, Gold, Cloudy, Violet} from './color'
// import {Clock} from './clock'

const NotefieldPosition = 220
const ColumnWidth = 48
const BorderWidth = 4
const KeyHeight = 96
const NoteHeight = 24
const NoteSpacing = 100

const BackgroundColor = Black.opacity(0.9)
const BorderColor = White.opacity(0.8)

class Note {
  constructor (public time: number, public color: Color) {}
  draw (songTime: number) {
    canvas.layer(() => {
      canvas.fillRect(0, (-this.time + songTime) * NoteSpacing, ColumnWidth, -NoteHeight, this.color)
    })
  }
}

class Column {
  notes: Note[] = []

  constructor (public color: Color) {}

  addNote (time: number) {
    this.notes.push(new Note(time, this.color))
  }

  draw (songTime: number) {
    // backlight
    canvas.layer(() => {
      canvas.fillRect(0, 0, ColumnWidth, canvas.height, this.color.opacity(0.05))
    })

    // receptor
    canvas.layer(() => {
      canvas.fillRect(0, canvas.height - KeyHeight, ColumnWidth, -NoteHeight, this.color.opacity(0.3))
    })

    // notes
    canvas.layer(() => {
      canvas.translate(0, canvas.height - KeyHeight)
      this.notes.forEach(note => note.draw(songTime))
    })

    // key
    canvas.layer(() => {
      canvas.fillRect(0, canvas.height, ColumnWidth, -KeyHeight, this.color)
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

    this.columns[0].addNote(0)
    this.columns[1].addNote(1)
    this.columns[2].addNote(2)
    this.columns[3].addNote(3)
    this.columns[4].addNote(4)
    this.columns[5].addNote(5)
  }

  setColumns (colors: Color[]) {
    this.columns = colors.map(color => new Column(color))
  }

  update (elapsed: number) {
    this.songTime += elapsed
  }

  draw () {
    const fieldWidth = this.columns.length * ColumnWidth

    canvas.layer(() => {
      // start at notefield position
      canvas.translate(NotefieldPosition, 0)

      // background shade
      canvas.layer(() => {
        canvas.fillRect(0, 0, fieldWidth, canvas.height, BackgroundColor)
      })

      // notefield edges
      canvas.layer(() => {
        canvas.setFillColor(BorderColor)
        canvas.translate(-BorderWidth, 0)
        canvas.fillRect(0, 0, BorderWidth, canvas.height)
        canvas.translate(fieldWidth + BorderWidth, 0)
        canvas.fillRect(0, 0, BorderWidth, canvas.height)
      })

      // columns
      canvas.layer(() => {
        this.columns.forEach(column => {
          column.draw(this.songTime)
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
