import React, {useState} from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'
import isKanji from 'iskanji'
import {useDropzone} from 'react-dropzone'
import {sumBy, toPairs, sortBy, countBy} from 'lodash'
import {readAsText} from 'promise-file-reader'
import parser from 'subtitles-parser'

function App() {
  const [frequentKanjis, setFrequentKanjis] = useState([])
  const [lines, setLines] = useState([])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    noClick: frequentKanjis.length > 0
  })

  return (
    <DropArea {...getRootProps()} over={isDragActive}>
      <input {...getInputProps()} />
      <Kanjis>
        {frequentKanjis.length === 0 ? (
          <Upload>Click or drag in a SRT file to analyze kanji usage</Upload>
        ) : (
          frequentKanjis.map(([kanji]) => (
            <KanjiItem key={kanji}>
              <Link
                href={`https://hochanh.github.io/rtk/${kanji}/`}
                target="heisig"
              >
                {kanji}
              </Link>
            </KanjiItem>
          ))
        )}
      </Kanjis>
      {frequentKanjis.length > 0 && (
        <Infos>
          <Info>{frequentKanjis.length} different kanji</Info>
          <KanjiLinePercentage {...{lines, frequentKanjis}} />
          <KanjiFrequency frequentKanjis={frequentKanjis} />
        </Infos>
      )}
    </DropArea>
  )

  function onDrop(files) {
    Promise.all(files.map(readAsText)).then((texts) => {
      const allLines = texts
        .map((text) => parser.fromSrt(text).map((s) => s.text))
        .flat()

      const kanjis = getFrequentKanjis(texts.join(''))

      setLines(allLines)
      setFrequentKanjis(kanjis)
    })
  }
}

function KanjiFrequency({frequentKanjis}) {
  const [nMostCommon, setNMostCommon] = useState(10)

  const firstN = frequentKanjis.slice(0, nMostCommon)

  const totalNumberOfKanjis = sumBy(frequentKanjis, (pairs) => pairs[1])
  const numberOfFirstN = sumBy(firstN, (pairs) => pairs[1])

  const percentage = Math.round((numberOfFirstN / totalNumberOfKanjis) * 100)

  return (
    <Info>
      The{' '}
      <Input
        onChange={onInput}
        type="number"
        step="5"
        value={nMostCommon}
        min="5"
        max="100"
      />{' '}
      most common kanji make out {percentage}% of all kanji usage
    </Info>
  )

  function onInput(e) {
    setNMostCommon(e.target.value)
  }
}

function KanjiLinePercentage({lines, frequentKanjis}) {
  const [nMostCommon, setNMostCommon] = useState(10)

  const firstN = frequentKanjis.slice(0, nMostCommon).map((k) => k[0])

  const withCommonKanjiLines = lines.filter((line) =>
    firstN.some((common) => line.includes(common))
  )

  const percentage = Math.round(
    (withCommonKanjiLines.length / lines.length) * 100
  )
  return (
    <Info>
      The{' '}
      <Input
        onChange={onInput}
        type="number"
        step="5"
        value={nMostCommon}
        min="5"
        max="100"
      />{' '}
      most common kanji are used in {percentage}% of lines
    </Info>
  )

  function onInput(e) {
    setNMostCommon(e.target.value)
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

const Input = styled.input`
  all: unset;
  background-color: #f4e8e7;
  border: 1px solid black;
`

const Link = styled.a`
  all: unset;
  cursor: pointer;
`

const Infos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4c1bd;
  padding: 2em;
  font-family: sans-serif;
  font-size: 2em;
  box-shadow: inset 0px 12px 11px 0px #ca9e9a;
`

const Info = styled.div`
  margin-bottom: 2em;
`

const Kanjis = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap-reverse;
  align-items: center;
  height: 100vh;
  width: 100%;
`

const KanjiItem = styled.div`
  font-size: 3em;
`

const DropArea = styled.div`
  width: 100%;
  background-color: ${({over}) => (over ? '#F4C1BD' : '#F4E8E7')};
`

ReactDom.render(<App />, document.getElementById('app'))

function getFrequentKanjis(subtitles) {
  const pairs = toPairs(countBy(subtitles.split('').filter(isKanji)))
  const sorted = sortBy(pairs, ([, count]) => -count)
  return sorted
}
