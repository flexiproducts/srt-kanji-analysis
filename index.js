import React, {useState} from 'react'
import ReactDom from 'react-dom'
import DropZone from 'react-drop-zone'
import styled from 'styled-components'
import isKanji from 'iskanji'
import _ from 'lodash'

function App() {
  const [frequentKanjis, setFrequentKanjis] = useState([])

  return (
    <DropZone
      onDrop={(file, text) => analyzeText(text)}
      handleClick={frequentKanjis.length === 0}
    >
      {({over}) => (
        <DropArea over={over}>
          {frequentKanjis.map(([kanji, freq]) => (
            <KanjiItem key={kanji}>
              {kanji} {freq}
            </KanjiItem>
          ))}
        </DropArea>
      )}
    </DropZone>
  )

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
