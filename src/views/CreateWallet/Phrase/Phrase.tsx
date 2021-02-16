import React, { useState, useCallback, useMemo, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons'
import {
  validatePhrase,
  generatePhrase,
  encryptToKeyStore,
  Keystore,
} from '@xchainjs/xchain-crypto'
import { Form, Tooltip } from 'antd'
import { Button, Input, Label } from 'components'

import { downloadAsFile } from 'helpers/download'

import { CONNECT_WALLET_ROUTE } from 'settings/constants'

import * as Styled from './Phrase.style'

type Props = {
  onConnect: (keystore: Keystore, phrase: string) => void
}

const PhraseView = ({ onConnect }: Props) => {
  const [phrase, setPhrase] = useState<string>()
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [invalideStatus, setInvalideStatus] = useState(false)
  const [processing, setProcessing] = useState(false)
  const ready = useMemo(
    () => password.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  )
  const words = useMemo(() => (phrase ? phrase.split(' ') : []), [phrase])

  useEffect(() => {
    setPhrase(generatePhrase())
  }, [])

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

  const handleGeneratePhrase = useCallback(() => {
    setPhrase(generatePhrase())
  }, [])

  const handleCreate = useCallback(async () => {
    if (ready && phrase) {
      setProcessing(true)

      try {
        const isValid = validatePhrase(phrase)
        if (!isValid) {
          return
        }

        const keystore = await encryptToKeyStore(phrase, password)

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
  }, [ready, phrase, password, onConnect])

  const renderPhrase = () => {
    return (
      <>
        <Styled.Generate>
          <Button
            onClick={handleGeneratePhrase}
            round
            fixedWidth={false}
            sizevalue="small"
          >
            <SyncOutlined />
          </Button>
          <Label color="primary">Generate Phrase</Label>
        </Styled.Generate>
        <Styled.PhraseContainer>
          {words.map((word, index) => {
            return (
              <Styled.PhraseWord key={index}>
                <Label color="primary">{index + 1}.</Label>
                <Label>{word}</Label>
              </Styled.PhraseWord>
            )
          })}
        </Styled.PhraseContainer>
      </>
    )
  }

  return (
    <Styled.Container>
      <Form onFinish={handleCreate}>
        <Styled.Content>
          {phrase && renderPhrase()}
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

export default PhraseView
