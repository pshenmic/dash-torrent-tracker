import { NavLink } from 'react-router'
import ConnectWallet from './ConnectWallet.jsx'

export default function TorrentTrackerHeader ({ walletInfo, setWalletInfo }) {
  return (
    <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <header className="flex justify-between w-6xl">
            <NavLink to="/" className="group flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"/>
                <img
                  className="relative h-12 w-12 rounded-xl shadow-lg ring-1 ring-white/10"
                  src="/dash_logo.png"
                  alt="Dash Logo"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dash Torrent Tracker
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Decentralized on testnet
                </p>
              </div>
            </NavLink>
            <ConnectWallet walletInfo={walletInfo} setWalletInfo={setWalletInfo}/>
          </header>
        </div>
      </div>
    </div>
  )
}
