import { useState } from 'react'
import ProfileChip from './ProfileChip.jsx'
import { WalletInfo } from '../models/WalletInfo.js'

export default function ConnectWallet ({ walletInfo, setWalletInfo }) {
  const [connectWalletError, setConnectWalletError] = useState('')

  const handleConnectWallet = async () => {
    setConnectWalletError('')

    try {
      if (!window.dashPlatformExtension) {
        return setConnectWalletError('Dash Platform Extension is not installed')
      }

      const appConnectInfo = await window.dashPlatformExtension.signer.connect()

      setWalletInfo(new WalletInfo(true, appConnectInfo.identities, appConnectInfo.currentIdentity))
    } catch (e) {
      console.error(e)
      setConnectWalletError('An unexpected error occurred during wallet connection.')
    }
  }

  return (
    walletInfo.connected ? <ProfileChip address={walletInfo.currentIdentity}/> :
      <div className="w-full sm:w-auto flex flex-col items-end">
        <button
          onClick={handleConnectWallet}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          Connect Wallet
        </button>
        {
          connectWalletError && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">{connectWalletError}</div>
          )
        }
      </div>
  )
}
