import * as canvas from './canvas'
import * as input from './input'
import {NoteExplosion} from './note-explosion'
import {Judgement, JudgementAnimation, getJudgement} from './judgement'
import {Color, White, Black, Gold, Cloudy, Violet} from './color'
import {lerp} from './util'
// import {Clock} from './clock'

const NotefieldPosition = 220
const ColumnWidth = 48
const BorderWidth = 4
const KeyHeight = 96
const NoteHeight = 24
const NoteSpacing = 100

const BackgroundColor = Black.opacity(0.9)
const BorderColor = White.opacity(0.8)

enum NoteState { Active, Inactive }

class Note {
  state = NoteState.Active

  constructor (public time: number, public color: Color) {}

  getTiming (songTime: number) {
    return songTime - this.time
  }

  draw (songTime: number) {
    if (this.state === NoteState.Inactive) return
    canvas.layer(() => {
      canvas.fillRect(0, (-this.time + songTime) * NoteSpacing, ColumnWidth, -NoteHeight, this.color)
    })
  }
}

class Column {
  notes: Note[] = []
  pressed = false
  released = false
  held = false
  brightness = 0

  constructor (public color: Color, public key: string) {}

  addNote (time: number) {
    this.notes.push(new Note(time, this.color))
    this.notes.sort((a, b) => a.time - b.time)
  }

  updateInputState () {
    const held = input.isDown(this.key)
    this.pressed = held && !this.held
    this.released = !held && this.held
    this.held = held
  }

  checkTap (songTime: number) {
    if (!this.pressed) return
    for (const note of this.notes) {
      if (note.state === NoteState.Active) {
        const timing = note.getTiming(songTime)
        const judge = getJudgement(timing)
        if (judge !== Judgement.Break) {
          note.state = NoteState.Inactive
          return judge
        }
      }
    }
  }

  updateBrightness (elapsed: number) {
    if (this.held) {
      this.brightness = 1
    } else {
      this.brightness = lerp(this.brightness, 0, elapsed * 18)
    }
  }

  draw (songTime: number) {
    // backlight
    canvas.layer(() => {
      const opacity = lerp(0.05, 0.15, this.brightness)
      canvas.fillRect(0, 0, ColumnWidth, canvas.height, this.color.opacity(opacity))
    })

    // receptor
    canvas.layer(() => {
      const opacity = lerp(0.25, 0.45, this.brightness)
      const color = this.color.opacity(opacity)
      canvas.fillRect(0, canvas.height - KeyHeight, ColumnWidth, -NoteHeight, color)
    })

    // notes
    canvas.layer(() => {
      canvas.translate(0, canvas.height - KeyHeight)
      this.notes.forEach(note => note.draw(songTime))
    })

    // key
    canvas.layer(() => {
      const value = lerp(0.8, 1.0, this.brightness)
      canvas.fillRect(0, canvas.height, ColumnWidth, -KeyHeight, this.color.multiply(value))
    })
  }
}

export class Notefield {
  explosion = new NoteExplosion()
  judgement = new JudgementAnimation()
  songTime = -3
  columns: Column[] = []

  constructor () {
    this.setColumns(
      [Gold, Cloudy, Violet, Cloudy, Violet, Cloudy],
      ['KeyA', 'KeyS', 'KeyD', 'KeyK', 'KeyL', 'Semicolon'])

    this.columns[0].addNote(0)
    this.columns[1].addNote(1)
    this.columns[2].addNote(2)
    this.columns[3].addNote(3)
    this.columns[4].addNote(4)
    this.columns[5].addNote(5)
    this.columns[0].addNote(6)
    this.columns[1].addNote(7)
    this.columns[2].addNote(8)
    this.columns[3].addNote(9)
    this.columns[4].addNote(10)
    this.columns[5].addNote(11)
  }

  setColumns (colors: Color[], keys: string[]) {
    this.columns = colors.map((color, i) => new Column(color, keys[i]))
  }

  update (elapsed: number) {
    this.songTime += elapsed
    this.judgement.update(elapsed)

    this.columns.forEach(col => {
      col.updateInputState()
      col.updateBrightness(elapsed)
      const score = col.checkTap(this.songTime)
      if (score != null) {
        this.judgement.play(score)
      }
    })
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

      // judgement
      this.judgement.draw(this.columns.length * ColumnWidth / 2, canvas.height / 2)
    })

    // note explosions
    this.explosion.draw()
  }
}
