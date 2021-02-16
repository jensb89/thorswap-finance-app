import React from 'react'

import { Label } from '../Label'
import * as Styled from './Information.style'

export type InformationProps = {
  title: string
  description: string
}

export const Information = ({ title, description }: InformationProps) => {
  return (
    <Styled.Container>
      <Label>
        <b>{title}: </b>
        {description}
      </Label>
    </Styled.Container>
  )
}
