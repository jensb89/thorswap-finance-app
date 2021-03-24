import React from 'react'

import { Label } from '../Label'
import * as Styled from './Information.style'

export type InformationProps = {
  title: string
  description: string
  error?: boolean
}

export const Information = ({
  title,
  description,
  error = false,
}: InformationProps) => {
  return (
    <Styled.Container>
      <Label color={error ? 'error' : 'normal'}>
        <b>{title}: </b>
        {description}
      </Label>
    </Styled.Container>
  )
}
