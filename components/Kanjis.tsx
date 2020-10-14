import React from 'react'
import styled from 'styled-components'
import {KanjiFrequencies} from '../types'

type KanjisProps = {
  kanjiFrequencies: KanjiFrequencies
}

export default function Kanjis({kanjiFrequencies}: KanjisProps) {
  return (
    <>
      {kanjiFrequencies.map(([kanji]) => (
        <KanjiItem key={kanji}>
          <Link
            href={`https://hochanh.github.io/rtk/${kanji}/`}
            target="heisig"
          >
            {kanji}
          </Link>
        </KanjiItem>
      ))}
    </>
  )
}

const Link = styled.a`
  all: unset;
  cursor: pointer;
`
const KanjiItem = styled.div`
  font-size: 3em;
`
