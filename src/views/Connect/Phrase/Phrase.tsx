import React, { useState, useCallback } from 'react'

import { Link } from 'react-router-dom'

import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  encryptToKeyStore,
  validatePhrase,
  Keystore,
} from '@xchainjs/xchain-crypto'
import { Form, Tooltip } from 'antd'
import { Button, Input, Label } from 'components'

import { downloadAsFile } from 'helpers/download'

import { CREATE_WALLET_ROUTE } from 'settings/constants'

import * as Styled from './Phrase.style'

type Props = {
  onConnect: (keystore: Keystore, phrase: string) => void
}

const PhraseView = ({ onConnect }: Props) => {
  const [phrase, setPhrase] = useState('')
  const [invalidPhrase, setInvalidPhrase] = useState(false)

  const [password, setPassword] = useState<string>('')
  const [invalideStatus, setInvalideStatus] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalideStatus(false)
    },
    [],
  )

  const handlePhraseChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhrase(e.target.value)
    },
    [],
  )

  const handleBackupKeystore = useCallback(async () => {
    if (phrase && password) {
      setProcessing(true)

      try {
        const isValidPhrase = validatePhrase(phrase)

        if (!isValidPhrase) {
          setInvalidPhrase(true)
          return
        }

        const keystore = await encryptToKeyStore(phrase, password)

        await downloadAsFile('asgardex-keystore.txt', JSON.stringify(keystore))

        onConnect(keystore, phrase)

        // clean up
        setPassword('')
        setPhrase('')
      } catch (error) {
        setInvalideStatus(true)
        console.error(error)
      }
      setProcessing(false)
    }
  }, [phrase, password, onConnect])

  const handleUnlock = useCallback(async () => {
    if (phrase && password) {
      setProcessing(true)

      try {
        const isValidPhrase = validatePhrase(phrase)

        if (!isValidPhrase) {
          setInvalidPhrase(true)
          return
        }

        const keystore = await encryptToKeyStore(phrase, password)
        console.log('keystore', keystore)

        // clean up
        setPassword('')
        setPhrase('')
        setProcessing(false)

        onConnect(keystore, phrase)
      } catch (error) {
        setProcessing(false)
        setInvalideStatus(true)
        console.error(error)
      }
    }
  }, [phrase, password, onConnect])

  const ready = password.length > 0 && !invalidPhrase && !processing

  return (
    <Styled.Container>
      <Form onFinish={handleUnlock}>
        <Styled.Content>
          <Styled.FormLabel weight="bold" color="normal">
            Please Enter Phrase
          </Styled.FormLabel>
          <Input
            value={phrase}
            onChange={handlePhraseChange}
            placeholder="Phrase"
            allowClear
            sizevalue="big"
          />
          {invalidPhrase && <Label color="error">Phrase is invalid</Label>}
          <Styled.PasswordInput>
            <Styled.PasswordLabel>
              <Label weight="bold" color="normal">
                Decryption password
              </Label>
              <Tooltip
                title="Password is used to backup keystore"
                placement="bottomRight"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Styled.PasswordLabel>
            <Input
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              allowClear
              disabled={!phrase}
              type="password"
              sizevalue="big"
            />
          </Styled.PasswordInput>
          {invalideStatus && <Label color="error">Something went wrong.</Label>}
        </Styled.Content>
        <Styled.Footer>
          <Styled.FooterContent>
            <Link to={CREATE_WALLET_ROUTE}>
              <Label color="primary">Create Wallet</Label>
            </Link>
            <Button
              htmlType="submit"
              onClick={handleBackupKeystore}
              disabled={!ready}
              round
              loading={processing}
              fixedWidth={false}
            >
              Backup Keystore
            </Button>
            <Button
              htmlType="submit"
              onClick={handleUnlock}
              disabled={!ready}
              round
              loading={processing}
              fixedWidth={false}
            >
              Unlock Wallet
            </Button>
          </Styled.FooterContent>
        </Styled.Footer>
      </Form>
    </Styled.Container>
  )
}

export default PhraseView
