import { TransactionResponse } from '@ethersproject/abstract-provider'
import { TxHash, Balance, Network } from '@xchainjs/xchain-client'
import {
  Client as EthClient,
  ETHAddress,
  getTokenAddress,
} from '@xchainjs/xchain-ethereum'
import { baseAmount, Chain, ETHChain } from '@xchainjs/xchain-util'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

import { ETH_DECIMAL } from 'multichain-sdk/constants'

import { ETHERSCAN_API_KEY, INFURA_PROJECT_ID } from '../config'
import { erc20ABI } from '../constants/erc20.abi'
import { TCRopstenAbi } from '../constants/thorchain-ropsten.abi'
import { AmountType, Amount, Asset, AssetAmount } from '../entities'
import { IClient } from './client'
import { TxParams, ApproveParams, DepositParams } from './types'

export interface IEthChain extends IClient {
  getClient(): EthClient
  getERC20AssetDecimal(asset: Asset): Promise<number>
}

export class EthChain implements IEthChain {
  private balances: AssetAmount[] = []

  private client: EthClient

  public readonly chain: Chain

  constructor({
    network = 'testnet',
    phrase,
  }: {
    network?: Network
    phrase: string
  }) {
    this.chain = ETHChain

    this.client = new EthClient({
      network,
      phrase,
      etherscanApiKey: ETHERSCAN_API_KEY,
      infuraCreds: { projectId: INFURA_PROJECT_ID },
    })
  }

  /**
   * get xchain-binance client
   */
  getClient(): EthClient {
    return this.client
  }

  get balance() {
    return this.balances
  }

  loadBalance = async (): Promise<AssetAmount[]> => {
    try {
      const balances: Balance[] = await this.client.getBalance()

      this.balances = balances.map((data: Balance) => {
        const { asset, amount } = data

        const assetObj = new Asset(asset.chain, asset.symbol)
        const amountObj = new Amount(
          amount.amount(),
          AmountType.BASE_AMOUNT,
          assetObj.decimal,
        )

        return new AssetAmount(assetObj, amountObj)
      })

      return this.balances
    } catch (error) {
      return Promise.reject(error)
    }
  }

  hasAmountInBalance = async (assetAmount: AssetAmount): Promise<boolean> => {
    try {
      await this.loadBalance()

      const assetBalance = this.balances.find((data: AssetAmount) =>
        data.asset.eq(assetAmount.asset),
      )

      if (!assetBalance) return false

      return assetBalance.amount.gte(assetAmount.amount)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getAssetBalance = async (asset: Asset): Promise<AssetAmount> => {
    try {
      await this.loadBalance()

      const assetBalance = this.balances.find((data: AssetAmount) =>
        data.asset.eq(asset),
      )

      if (!assetBalance)
        return new AssetAmount(asset, Amount.fromAssetAmount(0, asset.decimal))

      return assetBalance
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * transfer on binance chain
   * @param {TxParams} tx transfer parameter
   */
  transfer = async (tx: TxParams): Promise<TxHash> => {
    // use xchainjs-client standard internally
    try {
      const { assetAmount, recipient, memo, feeOptionKey = 'fastest' } = tx
      const { asset } = assetAmount
      const amount = baseAmount(assetAmount.amount.baseAmount)

      const txHash = await this.client.transfer({
        asset: asset.getAssetObj(),
        amount,
        recipient,
        memo,
        feeOptionKey,
      })

      return txHash
    } catch (error) {
      return Promise.reject(error)
    }
  }

  deposit = async (params: DepositParams): Promise<TxHash> => {
    const {
      assetAmount,
      recipient,
      memo,
      feeOptionKey = 'fastest',
      router,
    } = params

    const { asset } = assetAmount

    const amount = asset.isETH()
      ? baseAmount(0)
      : baseAmount(assetAmount.amount.baseAmount)

    const checkSummedAddress = this.getCheckSumAddress(asset)

    // get estimated gas price
    const gasAmount = await this.client.estimateGasPrices()

    // get gas amount based on the fee option
    const gasPrice = gasAmount?.[feeOptionKey].amount().toFixed(0)

    const contractParams = [
      recipient, // vault address
      checkSummedAddress, // asset checksum address
      amount.amount().toFixed(0, BigNumber.ROUND_DOWN), // deposit amount
      memo,
      asset.isETH()
        ? {
            value: amount.amount().toFixed(0, BigNumber.ROUND_DOWN),
            gasPrice,
          }
        : { gasPrice },
    ]

    const res: any = await this.client.call(
      router,
      TCRopstenAbi,
      'deposit',
      contractParams,
    )

    return res?.hash ?? ''
  }

  /**
   * @param param0 approve params
   * @returns approved status
   */
  isApproved = async ({ spender, sender }: ApproveParams): Promise<boolean> => {
    return this.client.isApproved(spender, sender, baseAmount(1))
  }

  /**
   * @param param0 approve params
   * @returns approved status
   */
  approve = async ({
    spender,
    sender,
  }: ApproveParams): Promise<TransactionResponse> => {
    return this.client.approve(spender, sender)
  }

  /**
   * get decimal for ERC20 token
   * @param asset ERC20 token
   * @returns decimal number
   */
  getERC20AssetDecimal = async (asset: Asset) => {
    if (asset.chain === 'ETH') {
      if (asset.symbol === 'ETH') {
        return ETH_DECIMAL
      }

      const assetAddress = asset.symbol.slice(asset.ticker.length + 1)
      const strip0x = assetAddress.substr(2)
      const checkSummedAddress = ethers.utils.getAddress(strip0x)
      const tokenContract = new ethers.Contract(
        checkSummedAddress,
        erc20ABI,
        this.client.getWallet(),
      )
      const tokenDecimals = await tokenContract.decimals()

      return tokenDecimals.toNumber()
    }
    throw new Error('invalid eth chain')
  }

  getCheckSumAddress = (asset: Asset): string => {
    if (asset.isETH()) return ETHAddress

    const assetAddress = getTokenAddress(asset.getAssetObj())

    if (assetAddress) {
      return ethers.utils.getAddress(assetAddress.toLowerCase())
    }

    throw new Error('invalid eth asset address')
  }
}
