import React, { useState, useCallback } from 'react'

import { LockOutlined } from '@ant-design/icons'
import { Form } from 'antd'

import { useWallet } from 'redux/wallet/hooks'

import useTimeout from 'hooks/useTimeout'

import { multichain } from 'services/multichain'

import { Input } from '../../UIElements'
import { StyledModal, ModalIcon, ModalData } from './ConfirmModal.style'

const MODAL_DISMISS_TIME = 15 * 1000 // 15s

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

  // dismiss modal after 15s automatically
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

    const isValid = await multichain.validateKeystore(keystore, password)

    if (isValid) {
      handleConfirm()
    } else {
      setInvalidPassword(true)
    }

    setValidating(false)
  }, [keystore, password, handleConfirm])

  const renderModalContent = () => {
    const modalIcon = (
      <ModalIcon>
        <LockOutlined />
      </ModalIcon>
    )

    return (
      <Form onFinish={handleOK} autoComplete="off">
        <Form.Item
          className={invalidPassword ? 'has-error' : ''}
          extra={validating ? 'Validating password ...' : ''}
        >
          <Input
            data-test="password-confirmation-input"
            type="password"
            typevalue="ghost"
            sizevalue="big"
            value={password}
            onChange={onChangePasswordHandler}
            prefix={modalIcon}
            autoComplete="off"
          />
          {invalidPassword && (
            <div className="ant-form-explain">Password is wrong.</div>
          )}
        </Form.Item>
      </Form>
    )
  }

  return (
    <StyledModal
      title="TRANSACTION CONFIRMATION"
      visible={visible}
      onOk={handleOK}
      onCancel={handleCancel}
      maskClosable={false}
      closable={false}
      okText="CONFIRM"
      cancelText="CANCEL"
    >
      {children && <ModalData>{children}</ModalData>}
      {renderModalContent()}
    </StyledModal>
  )
}
