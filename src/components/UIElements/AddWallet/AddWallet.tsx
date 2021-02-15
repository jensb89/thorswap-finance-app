import React from 'react'

import { Link } from 'react-router-dom'

import { SwitcherOutlined } from '@ant-design/icons'

import { WalletButton } from '../WalletButton'
import { AddWalletWrapper, ConnectLabel } from './AddWallet.style'

export const AddWallet: React.FC = (): JSX.Element => (
  <AddWalletWrapper>
    <div className="add-wallet-icon">
      <SwitcherOutlined />
    </div>
    <ConnectLabel>Please connect your wallet.</ConnectLabel>
    <Link to="/connect">
      <WalletButton />
    </Link>
  </AddWalletWrapper>
)
