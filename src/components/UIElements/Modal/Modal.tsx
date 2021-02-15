import React, { ReactNode } from 'react'

import { ModalProps } from 'antd/lib/modal'

import { ModalWrapper } from './Modal.style'

export interface Props extends ModalProps {
  children?: ReactNode
}

export const Modal: React.FC<Props> = (props): JSX.Element => {
  const { children, ...others } = props

  return (
    <ModalWrapper
      okButtonProps={{ className: 'ok-ant-btn' }}
      cancelButtonProps={{ className: 'cancel-ant-btn' }}
      {...others}
    >
      {children}
    </ModalWrapper>
  )
}
