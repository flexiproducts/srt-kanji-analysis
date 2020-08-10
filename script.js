/* eslint-disable no-undef */
const fs = require('fs')
const isKanji = require('iskanji')
const _ = require('lodash')
const parser = require('subtitles-parser')

const n = 10

const remove =
  '春香渡邉香織松松嵜翔平奥山春花吉原健司田辺莉咲子西野入流佳玲奈徳井義実葉山奨之馬場園梓'

const subtitles = fs.readFileSync('subtitles.srt', 'utf-8')
const subtitles2 = fs.readFileSync('subtitles2.srt', 'utf-8')

const lines = parser.fromSrt(subtitles).map((s) => s.text)

const sorted = getFrequentKanjis(subtitles)
const sorted2 = getFrequentKanjis(subtitles2)

console.log('number of different kanjis:', sorted.length)
console.log('number of different kanjis 2:', sorted2.length)

const kanji1 = sorted.map((sorted) => sorted[0])
const kanji2 = sorted2.map((sorted) => sorted[0])

console.log(
  'new kanji in episode 2',
  kanji2.filter((kanji) => !kanji1.includes(kanji)).length
)

const totalNumberOfKanjis = _.sumBy(sorted, (pairs) => pairs[1])
console.log('total number', totalNumberOfKanjis)

const firstN = sorted.slice(0, n)
const numberOfFirstN = _.sumBy(firstN, (pairs) => pairs[1])
console.log(`first ${n} number`, numberOfFirstN)

const commonKanji = firstN.map((k) => k[0])

console.log(firstN)
console.log('number of lines', lines.length)
const linesWithKanji = lines.filter((line) => line.split('').some(isKanji))
console.log('lines with kanji', linesWithKanji.length)
const withCommonKanjiLines = lines.filter((line) =>
  commonKanji.some((common) => line.includes(common))
)
console.log('lines with common kanji', withCommonKanjiLines.length)
console.log('all lines', (withCommonKanjiLines.length / lines.length) * 100)
console.log(
  'only kanji lines',
  (withCommonKanjiLines.length / linesWithKanji.length) * 100
)

sorted
  .slice(10, 20)
  .forEach(([kanji, count]) =>
    console.log(
      kanji,
      `https://jisho.org/search/${kanji}`,
      `https://hochanh.github.io/rtk/${kanji}`,
      count
    )
  )

function getFrequentKanjis(subtitles) {
  const pairs = _.toPairs(
    _.countBy(
      subtitles
        .split('')
        .filter(isKanji)
        .filter((kanji) => !remove.includes(kanji))
    )
  )
  const sorted = _.sortBy(pairs, ([, count]) => -count)
  return sorted
}
