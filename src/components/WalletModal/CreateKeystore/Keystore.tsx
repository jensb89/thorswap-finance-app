import React, { useState, useCallback, useMemo } from 'react'

import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  validatePhrase,
  generatePhrase,
  encryptToKeyStore,
  Keystore,
} from '@xchainjs/xchain-crypto'
import { Form, Tooltip } from 'antd'
import { Helmet, Button, Input, Label } from 'components'

import { downloadAsFile } from 'helpers/download'

import * as Styled from './Keystore.style'

type Props = {
  onConnect: (keystore: Keystore, phrase: string) => void
  toggleMode: () => void
}

const KeystoreView = ({ onConnect, toggleMode }: Props) => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [invalideStatus, setInvalideStatus] = useState(false)
  const [processing, setProcessing] = useState(false)
  const ready = useMemo(
    () => password.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  )

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalideStatus(false)
    },
    [],
  )

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value)
      if (password !== e.target.value) {
        setInvalideStatus(true)
      } else {
        setInvalideStatus(false)
      }
    },
    [password],
  )

  const handleCreate = useCallback(async () => {
    if (ready) {
      setProcessing(true)

      try {
        const phrase = generatePhrase()
        const isValid = validatePhrase(phrase)
        if (!isValid) {
          return
        }

        const keystore = await encryptToKeyStore(phrase, password)

        console.log(keystore)

        await downloadAsFile('asgardex-keystore.txt', JSON.stringify(keystore))

        // clean up
        setPassword('')
        setConfirmPassword('')

        onConnect(keystore, phrase)
      } catch (error) {
        setInvalideStatus(true)
        console.error(error)
      }
      setProcessing(false)
    }
  }, [ready, password, onConnect])

  return (
    <Styled.Container>
      <Helmet title="Create Wallet" content="Create Wallet" />
      <Form onFinish={handleCreate}>
        <Styled.Content>
          <Styled.PasswordInput>
            <Styled.PasswordLabel>
              <Label weight="bold" color="normal">
                Input Password
              </Label>
              <Tooltip
                title="This is the password used to decrypt your encrypted keystore file"
                placement="topLeft"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Styled.PasswordLabel>
            <Input
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter Password"
              allowClear
              type="password"
              sizevalue="big"
              autoComplete="new-password"
            />
          </Styled.PasswordInput>
          <Styled.PasswordInput>
            <Styled.FormLabel weight="bold" color="normal">
              Confirm Password
            </Styled.FormLabel>
            <Input
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              allowClear
              type="password"
              sizevalue="big"
              autoComplete="new-password"
            />
            {invalideStatus && (
              <Label color="error">Confirm password is wrong.</Label>
            )}
          </Styled.PasswordInput>
        </Styled.Content>
        <Styled.Footer>
          <Styled.FooterContent>
            <Button
              htmlType="submit"
              onClick={handleCreate}
              disabled={!ready}
              round
              loading={processing}
              fixedWidth={false}
            >
              Create
            </Button>
            <Styled.ActionButton onClick={toggleMode}>
              <Label color="primary">Connect Wallet</Label>
            </Styled.ActionButton>
          </Styled.FooterContent>
        </Styled.Footer>
      </Form>
    </Styled.Container>
  )
}

export default KeystoreView
