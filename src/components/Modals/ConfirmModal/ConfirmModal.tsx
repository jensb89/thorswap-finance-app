import React, { useState, useCallback } from 'react'

import { LockOutlined } from '@ant-design/icons'
import { Form } from 'antd'

import { useWallet } from 'redux/wallet/hooks'

import useTimeout from 'hooks/useTimeout'

import { multichain } from 'services/multichain'

import { Overlay, Input } from '../../UIElements'
import * as Styled from './ConfirmModal.style'

const MODAL_DISMISS_TIME = 25 * 1000 // 25s

export type ConfirmModalProps = {
  visible: boolean
  onOk?: () => void
  onCancel: () => void
  children?: React.ReactNode
}

export const ConfirmModal: React.FC<ConfirmModalProps> = (
  props,
): JSX.Element => {
  const { visible, onOk, onCancel, children } = props

  const { keystore } = useWallet()

  const [password, setPassword] = useState('')
  const [invalidPassword, setInvalidPassword] = useState(false)
  const [validating, setValidating] = useState(false)

  // dismiss modal after 25s
  useTimeout(() => {
    handleCancel()
  }, MODAL_DISMISS_TIME)

  const handleConfirm = useCallback(() => {
    if (!onOk || !visible) {
      return
    }

    onOk()
  }, [onOk, visible])

  const handleCancel = useCallback(() => {
    if (onCancel) {
      setPassword('')
      setInvalidPassword(false)
      setValidating(false)
      onCancel()
    }
  }, [onCancel])

  const onChangePasswordHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalidPassword(false)
    },
    [setPassword, setInvalidPassword],
  )

  const handleOK = useCallback(async () => {
    if (!keystore) return
    setValidating(true)

    try {
      const isValid = await multichain.validateKeystore(keystore, password)

      if (isValid) {
        handleConfirm()
      } else {
        setInvalidPassword(true)
      }
    } catch (error) {
      setInvalidPassword(true)
    }

    setValidating(false)
  }, [keystore, password, handleConfirm])

  const renderModalContent = () => {
    const modalIcon = (
      <Styled.ModalIcon>
        <LockOutlined />
      </Styled.ModalIcon>
    )

    return (
      <Form onFinish={handleOK} autoComplete="off">
        <Form.Item
          className={invalidPassword ? 'has-error' : ''}
          extra={validating ? 'Validating password ...' : ''}
        >
          <Input
            type="password"
            typevalue="ghost"
            sizevalue="big"
            value={password}
            onChange={onChangePasswordHandler}
            prefix={modalIcon}
            autoComplete="new-password"
          />
          {invalidPassword && (
            <div className="ant-form-explain">Password is wrong.</div>
          )}
        </Form.Item>
        <Styled.Button>Confirm</Styled.Button>
      </Form>
    )
  }

  return (
    <Overlay isOpen={visible} onDismiss={handleCancel}>
      <Styled.Content>
        {children && <Styled.ModalData>{children}</Styled.ModalData>}
        {renderModalContent()}
      </Styled.Content>
    </Overlay>
  )
}
