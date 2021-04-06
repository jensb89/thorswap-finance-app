import React from 'react'

import { Label } from '../Label'
import { Question } from '../Tooltip'
import * as Styled from './Information.style'

export type InformationProps = {
  title: string
  description: string
  error?: boolean
  tooltip?: string
}

export const Information = ({
  title,
  description,
  error = false,
  tooltip,
}: InformationProps) => {
  return (
    <Styled.Container>
      <Styled.Content>
        <Label weight="bold" color={error ? 'error' : 'normal'}>
          {title}:
        </Label>
        <Label color={error ? 'error' : 'normal'}>{description}</Label>
      </Styled.Content>
      {tooltip && <Question placement="top" tooltip={tooltip} />}
    </Styled.Container>
  )
}
