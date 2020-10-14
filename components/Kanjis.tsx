import React from 'react'
import styled from 'styled-components'
import {FrequentKanjis} from '../types'

type KanjisProps = {
  frequentKanjis: FrequentKanjis
}

export default function Kanjis({frequentKanjis}: KanjisProps) {
  return (
    <>
      {frequentKanjis.map(([kanji]) => (
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
