import React, { useState, useCallback, useMemo } from 'react'

import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  validatePhrase,
  generatePhrase,
  encryptToKeyStore,
} from '@xchainjs/xchain-crypto'
import { Form, Tooltip } from 'antd'
import { Button, Input, Label } from 'components'

import { downloadAsFile } from 'helpers/download'

import { CONNECT_WALLET_ROUTE, HOME_ROUTE } from 'settings/constants'

import * as Styled from './Keystore.style'

const KeystoreView = () => {
  const history = useHistory()

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
        // redirect to homepage
        history.push(HOME_ROUTE)
      } catch (error) {
        setInvalideStatus(true)
        console.error(error)
      }
      setProcessing(false)
    }
  }, [history, ready, password])

  return (
    <Styled.Container>
      <Form onFinish={handleCreate}>
        <Styled.Content>
          <Styled.PasswordInput>
            <Styled.PasswordLabel>
              <Label weight="bold" color="normal">
                Input Password
              </Label>
              <Tooltip
                title="This is the password used to decrypt your encrypted keystore file"
                placement="bottomRight"
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
            />
            {invalideStatus && (
              <Label color="error">Confirm password is wrong.</Label>
            )}
          </Styled.PasswordInput>
        </Styled.Content>
        <Styled.Footer>
          <Styled.FooterContent>
            <Link to={CONNECT_WALLET_ROUTE}>
              <Label color="primary">Connect Wallet</Label>
            </Link>
            <Button
              htmlType="submit"
              onClick={handleCreate}
              disabled={!ready}
              round
              loading={processing}
              fixedWidth={false}
            >
              Create Wallet
            </Button>
          </Styled.FooterContent>
        </Styled.Footer>
      </Form>
    </Styled.Container>
  )
}

export default KeystoreView
