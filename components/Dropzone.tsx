import React, {ReactNode} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'
import styled from 'styled-components'

type DropzoneProps = {
  onDrop: DropzoneOptions['onDrop']
  noClick: boolean
  children: ReactNode
}

export default function Dropzone({children, onDrop, noClick}: DropzoneProps) {
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
