import * as canvas from './canvas'
import * as input from './input'
import {Song} from './song'
import {NoteExplosion} from './note-explosion'
import {Judgement, TimingWindow} from './scoring'
import {JudgementAnimation} from './judgement-animation'
import {ComboAnimation} from './combo-animation'
import {Color, White, Black, Gold, Cloudy, Violet} from './color'
import {lerp} from './util'

const NotefieldPosition = 220
const ColumnWidth = 48
const BorderWidth = 4
const KeyHeight = 96
const NoteHeight = 24
const NoteSpacing = 100

const BackgroundColor = Black.opacity(0.9)
const BorderColor = White.opacity(0.8)

enum NoteState { Active, Holding, Hit, Missed }

class Note {
  state = NoteState.Active

  constructor (public time: number, public length: number, public color: Color) {}

  draw () {
    if (this.state === NoteState.Hit) return

    const receptorPosition = canvas.height - KeyHeight
    const scrollDirection = -1

    const headPosition = (this.time) * NoteSpacing
    const tailPosition = (this.time + this.length) * NoteSpacing

    const position = receptorPosition + headPosition * scrollDirection
    const holdLength = (tailPosition - headPosition) * scrollDirection

    canvas.fillRect(0, position, ColumnWidth, holdLength, this.getTailColor())
    canvas.fillRect(0, position, ColumnWidth, NoteHeight * scrollDirection,
      this.getHeadColor())
  }

  getHeadColor (): Color {
    const colors = {
      [NoteState.Active]: this.color,
      [NoteState.Holding]: this.color,
      [NoteState.Missed]: this.color.opacity(0.7),
    }
    return colors[this.state]
  }

  getTailColor (): Color {
    const colors = {
      [NoteState.Active]: this.color.opacity(0.65),
      [NoteState.Holding]: this.color.opacity(0.8),
      [NoteState.Missed]: this.color.opacity(0.4),
    }
    return colors[this.state]
  }

  getJudgement (songTime: number): Judgement {
    const diff = Math.abs(this.getTiming(songTime))
    if (diff <= TimingWindow.Absolute) return Judgement.Absolute
    if (diff <= TimingWindow.Perfect) return Judgement.Perfect
    if (diff <= TimingWindow.Good) return Judgement.Good
    return Judgement.None
  }

  getTiming (songTime: number): number {
    return songTime - this.time
  }
}

class Column {
  notes: Note[] = []
  pressed = false
  released = false
  holding = false
  brightness = 0
  currentNote = 0

  constructor (public color: Color, public key: string) {}

  addNote (time: number, length: number) {
    this.notes.push(new Note(time, length, this.color))
    this.notes.sort((a, b) => a.time - b.time)
  }

  updateInputState () {
    const holding = input.isDown(this.key)
    this.pressed = holding && !this.holding
    this.released = !holding && this.holding
    this.holding = holding
  }

  updateNotes (songTime: number): Judgement {
    const note = this.notes.find(note => note.state < NoteState.Hit)
    if (note) {
      if (note.state === NoteState.Active) {
        if (this.pressed) {
          const judgement = note.getJudgement(songTime)
          if (judgement !== Judgement.None) {
            if (note.length === 0) {
              note.state = NoteState.Hit
            } else {
              note.state = NoteState.Holding
            }
          }
          return judgement
        } else if (songTime > note.time + TimingWindow.Good) {
          note.state = NoteState.Missed
          return Judgement.Break
        }
      } else if (note.state === NoteState.Holding) {
        if (this.released) {
          if (songTime > note.time + note.length - TimingWindow.Good) {
            note.state = NoteState.Hit
          } else {
            note.state = NoteState.Missed
            return Judgement.Break
          }
        } else if (this.holding) {
          if (songTime > note.time + note.length) {
            note.state = NoteState.Hit
          }
        }
      }
    }
    return Judgement.None
  }

  updateBrightness (dt: number) {
    if (this.holding) {
      this.brightness = 1
    } else {
      this.brightness = lerp(this.brightness, 0, dt * 18)
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
      canvas.translate(0, songTime * NoteSpacing)
      this.notes.forEach(note => note.draw())
    })

    // key
    canvas.layer(() => {
      const value = lerp(0.8, 1.0, this.brightness)
      canvas.fillRect(0, canvas.height, ColumnWidth, -KeyHeight, this.color.multiply(value))
    })
  }
}

export class Notefield {
  columns: Column[] = []
  explosion = new NoteExplosion()
  judgement = new JudgementAnimation()
  combo = new ComboAnimation()

  constructor (public song: Song) {
    this.setColumns(
      [Gold, Cloudy, Violet, Cloudy, Violet, Cloudy],
      ['KeyA', 'KeyS', 'KeyD', 'KeyK', 'KeyL', 'Semicolon'])

    this.columns[0].addNote(0, 1)
    this.columns[1].addNote(1, 1)
    this.columns[2].addNote(2, 1)
    this.columns[3].addNote(3, 1)
    this.columns[4].addNote(4, 1)
    this.columns[5].addNote(5, 1)
    this.columns[0].addNote(6, 0)
    this.columns[1].addNote(7, 0)
    this.columns[2].addNote(8, 0)
    this.columns[3].addNote(9, 0)
    this.columns[4].addNote(10, 0)
    this.columns[5].addNote(11, 0)
  }

  setColumns (colors: Color[], keys: string[]) {
    this.columns = colors.map((color, i) => new Column(color, keys[i]))
  }

  update (dt: number) {
    this.judgement.update(dt)
    this.combo.update(dt)

    this.columns.forEach(col => {
      col.updateInputState()
      col.updateBrightness(dt)

      const judgement = col.updateNotes(this.song.time)
      if (judgement !== Judgement.None) {
        this.judgement.play(judgement)
        if (judgement !== Judgement.Break) {
          this.combo.add(1)
        } else {
          this.combo.reset()
        }
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
          column.draw(this.song.time)
          canvas.translate(ColumnWidth, 0)
        })
      })

      // combo
      this.combo.draw(fieldWidth / 2, canvas.height / 2 - 120)

      // judgement
      this.judgement.draw(fieldWidth / 2, canvas.height / 2 + 80)
    })

    // note explosions
    this.explosion.draw()
  }
}
