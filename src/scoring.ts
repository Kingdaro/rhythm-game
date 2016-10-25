import * as canvas from './canvas'
import {clamp, lerp} from './util'
import {Blue, Orange, Green, Red, Cloudy} from './color'

const {ceil} = Math

export const enum Judgement { None, Break, Good, Perfect, Absolute }

export const TimingWindow = {
  Absolute: 15 / 1000,
  Perfect: 70 / 1000,
  Good: 130 / 1000,
}

const JudgementColor = {
  [Judgement.Absolute]: Blue,
  [Judgement.Perfect]: Orange,
  [Judgement.Good]: Green,
  [Judgement.Break]: Red,
}

const JudgementText = {
  [Judgement.Absolute]: 'ABSOLUTE',
  [Judgement.Perfect]: 'PERFECT',
  [Judgement.Good]: 'GOOD',
  [Judgement.Break]: 'BREAK',
}
