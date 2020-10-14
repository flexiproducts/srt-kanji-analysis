import {sumBy} from 'lodash'
import React, {useState} from 'react'
import styled from 'styled-components'
import {FrequentKanjis, Lines} from '../types'

type AnalysisProps = {
  frequentKanjis: FrequentKanjis
  lines: Lines
}

export default function Analysis({frequentKanjis, lines}: AnalysisProps) {
  return (
    <Infos>
      <Info>{frequentKanjis.length} different kanji</Info>
      <KanjiLinePercentage {...{lines, frequentKanjis}} />
      <KanjiFrequency frequentKanjis={frequentKanjis} />
    </Infos>
  )
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

const Input = styled.input`
  all: unset;
  background-color: #f4e8e7;
  border: 1px solid black;
`
const Info = styled.div`
  margin-bottom: 2em;
`
