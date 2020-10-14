import React, {useState} from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'
import {toPairs, sortBy, countBy, flatten} from 'lodash'
import isKanji from 'iskanji'
import {readAsText} from 'promise-file-reader'
import parser from 'subtitles-parser'
import Dropzone from './components/Dropzone'
import Analysis from './components/Analysis'
import {FrequentKanjis, Lines} from './types'
import Kanjis from './components/Kanjis'

function App() {
  const [frequentKanjis, setFrequentKanjis] = useState<FrequentKanjis>([])
  const [lines, setLines] = useState<Lines>([])

  return (
    <Dropzone noClick={frequentKanjis.length > 0} onDrop={onDrop}>
      <Main>
        {frequentKanjis.length === 0 ? (
          <Upload>Click or drag in a SRT file to analyze kanji usage</Upload>
        ) : (
          <Kanjis {...{frequentKanjis}} />
        )}
      </Main>
      {frequentKanjis.length > 0 && <Analysis {...{frequentKanjis, lines}} />}
    </Dropzone>
  )

  function onDrop(files) {
    Promise.all(files.map(readAsText)).then((texts) => {
      const allLines = flatten(
        texts.map((text) => parser.fromSrt(text).map((s) => s.text))
      )

      const kanjis = getFrequentKanjis(texts.join(''))

      setLines(allLines)
      setFrequentKanjis(kanjis)
    })
  }

  function getFrequentKanjis(subtitles) {
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
