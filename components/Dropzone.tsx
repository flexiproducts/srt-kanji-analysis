import React from 'react'
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components'

export default function Dropzone({children, onDrop, noClick}) {
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    noClick
  })

  const dropAreaProps = {
    ...getRootProps(),
    over: isDragActive
  }

  return (
    <Container {...dropAreaProps}>
      <input {...getInputProps()} />
      {children}
    </Container>
  )
}

const Container = styled.div<{over: boolean}>`
  width: 100%;
  background-color: ${({over}) => (over ? '#F4C1BD' : '#F4E8E7')};
`
