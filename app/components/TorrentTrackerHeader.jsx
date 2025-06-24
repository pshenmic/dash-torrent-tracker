import { NavLink } from 'react-router'

export default function TorrentTrackerHeader() {
  return (
    <header className="relative">
      <NavLink 
        to="/" 
        className="group flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full" />
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
    </header>
  )
}
