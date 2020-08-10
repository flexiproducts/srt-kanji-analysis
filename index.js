import React, {useState} from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'
import isKanji from 'iskanji'
import {useDropzone} from 'react-dropzone'
import _ from 'lodash'
import {readAsText} from 'promise-file-reader'

function App() {
  const [frequentKanjis, setFrequentKanjis] = useState([])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    noClick: frequentKanjis.length > 0
  })

  return (
    <DropArea {...getRootProps()} over={isDragActive}>
      <input {...getInputProps()} />
      {frequentKanjis.map(([kanji, freq]) => (
        <KanjiItem key={kanji}>
          {kanji} {freq}
        </KanjiItem>
      ))}
    </DropArea>
  )

  function onDrop(files) {
    Promise.all(files.map(readAsText)).then((texts) =>
      analyzeText(texts.join())
    )
  }

  function analyzeText(text) {
    setFrequentKanjis(getFrequentKanjis(text))
  }
}

const KanjiItem = styled.div`
  font-size: 3em;
`

const DropArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  width: 100%;
  background-color: ${({over}) => (over ? '#F4C1BD' : '#F4E8E7')};
`

ReactDom.render(<App />, document.getElementById('app'))

function getFrequentKanjis(subtitles) {
  const pairs = _.toPairs(_.countBy(subtitles.split('').filter(isKanji)))
  const sorted = _.sortBy(pairs, ([, count]) => -count)
  return sorted
}
