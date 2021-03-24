/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
export type Faq = {
  title: string
  content: string
}

export const faqs: Faq[] = [
  {
    title: 'How do I connect my new wallet?',
    content:
      'Click the ADD WALLET pill on the header and select KEYSTORE from the options. Browse your local disk and find the testnet keystore saved from the telegram bot. Enter the password and click OK. Your wallet will now be loaded and your binance chain address shown on the wallet button on the header. Click the wallet button to open the wallet drawer, your BEP2 assets will be shown.',
  },
  {
    title: 'How do I swap?',
    content:
      'Once your wallet is connected, click SWAP from the header and then click SWAP against the pool you wish to swap across, for example BNB<>RUNE. Enter the amount you wish to swap and then simply DRAG TO SWAP, after entering your wallet password the swap will commence. When the swap has completed youll receive a confirmation and the assets can be verified in your wallet. For your protection a slip limit of 3% is enforced to avoid loss of funds. Simply click the lock icon to remove this restriction to increase the slip limit to 30%.',
  },
  {
    title: 'What is staking?',
    content:
      'On THORChain, swappers access liquidity provided by agents who add their unproductive assets to earn fees on every swap. Anyone can contribute liquidity to the pools by staking in the pool of their choice. BEPSwap will provide a live view of your returns and how much fees are being earned by providing liquidity. In this way assets become productive to the pool member.',
  },
  {
    title: 'How do I add liquidity?',
    content:
      'Click on ADD from the header menu and select the pool you wish to add liquidity in. eg. BNB. Use the slider to select the amount of asset you wish to add liquidity, or enter an amount. BEPSwap will select the optimal ratio based on the current ratio (pool price) of assets in the pool; however you can override this if you want. Drag to add, enter your password and youre done! Your liquidity should appear within a few minutes and can be viewed on the add liquidity screen or within the wallet drawer.',
  },
  {
    title: 'Where can I provide feedback?',
    content:
      'Feedback is always appreciated and we encourage you to submit issues to gitlab (https://gitlab.com/thorchain/bepswap) or in telegram (https://t.me/thorchain_org).',
  },
]
