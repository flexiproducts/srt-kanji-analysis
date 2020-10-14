import React, {useState} from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'
import {toPairs, sortBy, countBy, flatten} from 'lodash'
import isKanji from 'iskanji'
import {readAsText} from 'promise-file-reader'
import parser from 'subtitles-parser'

import Dropzone from './components/Dropzone'
import Analysis from './components/Analysis'
import Kanjis from './components/Kanjis'
import {KanjiFrequencies, Lines} from './types'

function App() {
  const [kanjiFrequencies, setKanjiFrequencies] = useState<KanjiFrequencies>([])
  const [lines, setLines] = useState<Lines>([])

  const noKanjis = kanjiFrequencies.length === 0

  return (
    <Dropzone noClick={!noKanjis} onDrop={onDrop}>
      <Main>
        {noKanjis ? (
          <Upload>Click or drag in a SRT file to analyze kanji usage</Upload>
        ) : (
          <Kanjis {...{kanjiFrequencies}} />
        )}
      </Main>
      {!noKanjis && <Analysis {...{kanjiFrequencies, lines}} />}
    </Dropzone>
  )

  async function onDrop(files: File[]) {
    const texts = await Promise.all(files.map(readAsText))
    const allLines: Lines = flatten(
      texts.map((text) => parser.fromSrt(text).map(({text}) => text))
    )

    const kanjis = calculateKanjiFrequencies(texts.join(''))

    setLines(allLines)
    setKanjiFrequencies(kanjis)
  }

  function calculateKanjiFrequencies(subtitles: string): KanjiFrequencies {
    const pairs = toPairs(countBy(subtitles.split('').filter(isKanji)))
    const sorted = sortBy(pairs, ([, count]) => -count)
    return sorted
  }
}

const Upload = styled.div`
  font-size: 3em;
  font-family: sans-serif;
  cursor: pointer;
  height: 100vh;
  display: flex;
  align-items: center;
`

const Main = styled.section`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap-reverse;
  align-items: center;
  height: 100vh;
  width: 100%;
`

ReactDom.render(<App />, document.getElementById('app'))
