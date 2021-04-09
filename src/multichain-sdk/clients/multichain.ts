import {
  TxHash,
  Network,
  Fees,
  TxsPage,
  TxHistoryParams,
  Tx,
} from '@xchainjs/xchain-client'
import { decryptFromKeystore, Keystore } from '@xchainjs/xchain-crypto'
import { getTokenAddress } from '@xchainjs/xchain-ethereum'
import {
  baseAmount,
  Chain,
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
} from '@xchainjs/xchain-util'
import {
  MidgardV2,
  NetworkType as MidgardNetwork,
  InboundAddressesItem,
} from 'midgard-sdk'

import { Swap, Memo, Asset, AssetAmount } from '../entities'
import { BnbChain } from './binance'
import { BtcChain } from './bitcoin'
import { BchChain } from './bitcoinCash'
import { EthChain } from './ethereum'
import { LtcChain } from './litecoin'
import { ThorChain } from './thorchain'
import {
  TxParams,
  AddLiquidityParams,
  WithdrawParams,
  Wallet,
  ChainWallet,
  supportedChains,
  SupportedChain,
  AddLiquidityTxns,
  UpgradeParams,
} from './types'

// specifying non-eth client is needed for getFees method
type NonETHChainClient = BnbChain | BtcChain | LtcChain | ThorChain

// thorchain pool address is empty string
const THORCHAIN_POOL_ADDRESS = ''

export interface IMultiChain {
  chains: typeof supportedChains
  midgard: MidgardV2
  network: string

  wallets: Wallet | null

  thor: ThorChain
  btc: BtcChain
  bnb: BnbChain
  eth: EthChain
  ltc: LtcChain
  bch: BchChain

  getPhrase(): string
  setPhrase(phrase: string): void
  validateKeystore(keystore: Keystore, password: string): Promise<boolean>

  getMidgard(): MidgardV2

  getChainClient(chain: Chain): void

  getPoolAddressDataByChain(chain: Chain): Promise<InboundAddressesItem>

  getWalletByChain(chain: Chain): Promise<ChainWallet>
  loadAllWallets(): Promise<Wallet | null>
  getWalletAddressByChain(chain: Chain): string | null

  getExplorerUrl(chain: Chain): string
  getExplorerAddressUrl(chain: Chain, address: string): string
  getExplorerTxUrl(chain: Chain, txHash: string): string

  getTransactions(chain: Chain, params?: TxHistoryParams): Promise<TxsPage>
  getTransactionData(chain: Chain, txHash: string): Promise<Tx>

  getFees(chain: Chain): Promise<Fees>

  isAssetApproved(asset: Asset): Promise<boolean>
  approveAsset(asset: Asset): Promise<TxHash | null>

  transfer(tx: TxParams, native?: boolean): Promise<TxHash>
  swap(swap: Swap, recipient?: string): Promise<TxHash>
  addLiquidity(params: AddLiquidityParams): Promise<AddLiquidityTxns>
  withdraw(params: WithdrawParams): Promise<TxHash>
  upgrade(params: UpgradeParams): Promise<TxHash>
}

export class MultiChain implements IMultiChain {
  private phrase: string

  private wallet: Wallet | null = null

  public readonly chains = supportedChains

  public readonly midgard: MidgardV2

  public readonly network: Network

  public thor: ThorChain

  public btc: BtcChain

  public bnb: BnbChain

  public eth: EthChain

  public bch: BchChain

  public ltc: LtcChain

  constructor({
    network = 'testnet',
    phrase = '',
  }: {
    network?: Network
    phrase?: string
  }) {
    this.network = network
    this.phrase = phrase

    // create midgard client
    this.midgard = new MidgardV2(MultiChain.getMidgardNetwork(network))

    // create chain clients
    this.thor = new ThorChain({ network, phrase })
    this.bnb = new BnbChain({ network, phrase })
    this.btc = new BtcChain({ network, phrase })
    this.eth = new EthChain({ network, phrase })
    this.ltc = new LtcChain({ network, phrase })
    this.bch = new BchChain({ network, phrase })
  }

  setPhrase = (phrase: string) => {
    this.phrase = phrase

    this.bnb.getClient().setPhrase(phrase)
    this.btc.getClient().setPhrase(phrase)
    this.ltc.getClient().setPhrase(phrase)
    this.bch.getClient().setPhrase(phrase)

    this.thor = new ThorChain({ network: this.network, phrase })
    this.eth = new EthChain({ network: this.network, phrase })

    this.initWallet()
  }

  getPhrase = () => {
    return this.phrase
  }

  // used to validate keystore and password with phrase
  validateKeystore = async (keystore: Keystore, password: string) => {
    const phrase = await decryptFromKeystore(keystore, password)

    return phrase === this.phrase
  }

  initWallet = () => {
    this.wallet = {
      THOR: {
        address: this.thor.getClient().getAddress(),
        balance: [],
      },
      BNB: {
        address: this.bnb.getClient().getAddress(),
        balance: [],
      },
      BTC: {
        address: this.btc.getClient().getAddress(),
        balance: [],
      },
      ETH: {
        address: this.eth.getClient().getAddress(),
        balance: [],
      },
      LTC: {
        address: this.ltc.getClient().getAddress(),
        balance: [],
      },
      BCH: {
        address: this.bch.getClient().getAddress(),
        balance: [],
      },
    }
  }

  /**
   * return midgard network type
   *
   * @param network mainnet or testnet
   */
  public static getMidgardNetwork(network: Network): MidgardNetwork {
    if (network === 'testnet') return 'testnet'
    return 'chaosnet'
  }

  get wallets(): Wallet | null {
    return this.wallet
  }

  /**
   * get midgard client
   */
  getMidgard(): MidgardV2 {
    return this.midgard
  }

  getPoolAddressDataByChain = async (
    chain: Chain,
  ): Promise<InboundAddressesItem> => {
    try {
      // for thorchain, return empty string
      if (chain === THORChain) {
        return {
          address: THORCHAIN_POOL_ADDRESS,
          halted: false,
          chain: 'THORChain',
          pub_key: '',
        }
      }

      const poolAddress = await this.midgard.getInboundDataByChain(chain)

      return poolAddress
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getChainClient = (chain: Chain) => {
    if (chain === THORChain) return this.thor
    if (chain === BNBChain) return this.bnb
    if (chain === BTCChain) return this.btc
    if (chain === ETHChain) return this.eth
    if (chain === LTCChain) return this.ltc
    if (chain === BCHChain) return this.bch

    return null
  }

  getWalletByChain = async (chain: Chain): Promise<ChainWallet> => {
    const chainClient = this.getChainClient(chain)

    if (!chainClient) throw new Error('invalid chain')

    try {
      const balance = (await chainClient?.loadBalance()) ?? []
      const address = chainClient.getClient().getAddress()

      if (this.wallet && chain in this.wallet) {
        this.wallet = {
          ...this.wallet,
          [chain]: {
            address,
            balance,
          },
        }
      }

      return {
        address,
        balance,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  loadAllWallets = async (): Promise<Wallet | null> => {
    try {
      await Promise.all(
        this.chains.map((chain: SupportedChain) => {
          return new Promise((resolve) => {
            this.getWalletByChain(chain)
              .then((data) => resolve(data))
              .catch((err) => {
                console.log(err)
                resolve([])
              })
          })
        }),
      )

      console.log('wallet', this.wallet)
      return this.wallet
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getWalletAddressByChain = (chain: Chain): string | null => {
    if (this.wallet && chain in this.wallet) {
      return this.wallet?.[chain as SupportedChain]?.address ?? null
    }

    return null
  }

  getExplorerUrl = (chain: Chain): string => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) return '#'

    return chainClient.getClient().getExplorerUrl()
  }

  getExplorerAddressUrl = (chain: Chain, address: string): string => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) return '#'

    return chainClient.getClient().getExplorerAddressUrl(address)
  }

  getExplorerTxUrl = (chain: Chain, txHash: string): string => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) return '#'

    return chainClient.getClient().getExplorerTxUrl(txHash)
  }

  getTransactions = (
    chain: Chain,
    params?: TxHistoryParams,
  ): Promise<TxsPage> => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient || !params) throw new Error('invalid chain')

    return chainClient.getClient().getTransactions(params)
  }

  getTransactionData = (chain: Chain, txHash: string): Promise<Tx> => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) throw new Error('invalid chain')

    return chainClient.getClient().getTransactionData(txHash)
  }

  getFees = (chain: Chain, tx?: TxParams): Promise<Fees> => {
    const chainClient = this.getChainClient(chain)
    if (!chainClient) throw new Error('invalid chain')

    if (chain === 'ETH' && tx) {
      const { assetAmount, recipient } = tx
      const { asset } = assetAmount
      const amount = baseAmount(assetAmount.amount.baseAmount)

      const assetObj = {
        chain: asset.chain,
        symbol: asset.symbol,
        ticker: asset.ticker,
      }
      return chainClient.getClient().getFees({
        asset: assetObj,
        amount,
        recipient,
      })
    }

    return (chainClient as NonETHChainClient).getClient().getFees()
  }

  isAssetApproved = async (asset: Asset): Promise<boolean> => {
    if (asset.chain !== ETHChain || asset.isETH()) return true

    const { router } = await this.getPoolAddressDataByChain(ETHChain)

    const assetAddress = getTokenAddress(asset.getAssetObj())

    if (router && assetAddress) {
      const isApproved = await this.eth.isApproved({
        spender: router,
        sender: assetAddress,
      })

      return isApproved
    }

    return false
  }

  approveAsset = async (asset: Asset): Promise<TxHash | null> => {
    if (asset.chain !== ETHChain || asset.isETH()) return null

    const { router } = await this.getPoolAddressDataByChain(ETHChain)

    const assetAddress = getTokenAddress(asset.getAssetObj())

    if (router && assetAddress) {
      return this.eth.approve({
        spender: router,
        sender: assetAddress,
      })
    }

    return null
  }

  /**
   * transfer on binance chain
   * @param {TxParams} tx transfer parameter
   */
  transfer = async (
    tx: TxParams & { router?: string },
    native = true,
  ): Promise<TxHash> => {
    const { chain } = tx.assetAmount.asset

    // for swap, add, withdraw tx in thorchain, send deposit tx
    if (
      chain === THORChain &&
      tx.recipient === THORCHAIN_POOL_ADDRESS &&
      native
    ) {
      return this.thor.deposit(tx)
    }

    // deposit contract for eth chain
    if (chain === ETHChain) {
      if (tx.router) {
        return this.eth.deposit({
          ...tx,
          router: tx.router,
        })
      }
      throw new Error('Invalid ETH Router')
    }

    const chainClient = this.getChainClient(chain)
    if (chainClient) {
      try {
        return await chainClient.transfer(tx)
      } catch (error) {
        return Promise.reject(error)
      }
    } else {
      throw new Error('Chain does not exist')
    }
  }

  /**
   * swap assets
   * @param {Swap} swap Swap Object
   */
  swap = async (swap: Swap, recipient?: string): Promise<TxHash> => {
    /**
     * 1. check if swap has sufficient fee
     * 2. get pool address
     * 3. get swap memo
     * 4. transfer input asset to pool address
     */

    try {
      if (!this.wallet) {
        return await Promise.reject(new Error('Wallet not detected'))
      }

      const walletAddress = this.getWalletAddressByChain(swap.outputAsset.chain)

      if (!walletAddress) {
        return await Promise.reject(new Error('Wallet Address not detected'))
      }

      if (swap.hasInSufficientFee) {
        return await Promise.reject(new Error('Insufficient Fee'))
      }

      const recipientAddress = recipient || walletAddress

      const {
        address: poolAddress,
        router,
      } = await this.getPoolAddressDataByChain(swap.inputAsset.chain)
      const memo = Memo.swapMemo(
        swap.outputAsset,
        recipientAddress,
        swap.minOutputAmount, // slip limit
      )

      return await this.transfer({
        assetAmount: swap.inputAmount,
        recipient: poolAddress,
        memo,
        router,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * add liquidity to pool
   * @param {AddLiquidityParams} params
   */
  addLiquidity = async (
    params: AddLiquidityParams,
  ): Promise<AddLiquidityTxns> => {
    /**
     * 1. get pool address
     * 2. get add liquidity memo
     * 3. check add type (Sym or Asym add)
     * 4. add liquidity to pool
     */

    try {
      const { pool, runeAmount, assetAmount } = params
      const { chain } = pool.asset

      const { address: poolAddress } = await this.getPoolAddressDataByChain(
        chain,
      )

      // sym stake
      if (
        runeAmount &&
        runeAmount.gt(runeAmount._0_AMOUNT) &&
        assetAmount &&
        assetAmount.gt(assetAmount._0_AMOUNT)
      ) {
        const assetAddress = this.getWalletAddressByChain(chain) || ''
        const thorAddress = this.getWalletAddressByChain(THORChain) || ''

        // 1. send rune (NOTE: recipient should be empty string)
        const runeTx = await this.transfer({
          assetAmount: runeAmount,
          recipient: THORCHAIN_POOL_ADDRESS,
          memo: Memo.depositMemo(pool.asset, assetAddress),
        })

        // 2. send asset
        const assetTx = await this.transfer({
          assetAmount,
          recipient: poolAddress,
          memo: Memo.depositMemo(pool.asset, thorAddress),
        })

        return {
          runeTx,
          assetTx,
        }
      }

      // asym deposit for asset
      if (!runeAmount || runeAmount.lte(runeAmount._0_AMOUNT)) {
        if (!assetAmount || assetAmount.lte(assetAmount._0_AMOUNT)) {
          return await Promise.reject(new Error('Invalid Asset Amount'))
        }

        const assetTx = await this.transfer({
          assetAmount,
          recipient: poolAddress,
          memo: Memo.depositMemo(pool.asset),
        })

        return {
          assetTx,
        }
      }

      // asym deposit for rune
      const assetTx = await this.transfer({
        assetAmount: runeAmount,
        recipient: poolAddress,
        memo: Memo.depositMemo(pool.asset),
      })

      return {
        assetTx,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * withdraw asset from pool
   * @param {WithdrawParams} params
   */
  withdraw = async (params: WithdrawParams): Promise<TxHash> => {
    /**
     * 1. get pool address
     * 2. get withdraw memo
     * 3. transfer withdraw tx
     */

    try {
      const { pool, percent } = params
      const memo = Memo.withdrawMemo(pool.asset, percent)

      // get thorchain pool address
      const { address: poolAddress } = await this.getPoolAddressDataByChain(
        THORChain,
      )

      const txHash = await this.transfer({
        assetAmount: AssetAmount.getMinAmountByChain(THORChain),
        recipient: poolAddress,
        memo,
      })

      return txHash
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Upgrade asset from pool
   * @param {UpgradeParams} params
   */
  upgrade = async (params: UpgradeParams): Promise<TxHash> => {
    /**
     * 1. get pool address
     * 2. get rune wallet address (BNB.RUNE or ETH.RUNE)
     * 3. get upgrade memo
     * 4. transfer upgrade tx
     */

    try {
      const { runeAmount } = params
      const { chain } = runeAmount.asset

      const {
        address: poolAddress,
        router,
      } = await this.getPoolAddressDataByChain(chain)
      const walletAddress = this.getWalletAddressByChain(THORChain)

      if (!walletAddress) {
        throw Error('rune wallet not found')
      }

      const memo = Memo.upgradeMemo(walletAddress)

      if (chain === BNBChain) {
        const txHash = await this.transfer({
          assetAmount: runeAmount,
          recipient: poolAddress,
          memo,
        })
        return txHash
      }

      if (chain === ETHChain && router) {
        const txHash = await this.transfer({
          router,
          assetAmount: runeAmount,
          recipient: poolAddress,
          memo,
        })
        return txHash
      }

      throw Error('upgrade failed')
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
