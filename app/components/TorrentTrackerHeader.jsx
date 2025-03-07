import { NavLink, redirect } from 'react-router'

export default function TorrentTrackerHeader() {
  return <div className="space-y-2 text-center sm:text-left">
    <NavLink to="/" end>
      <div className="space-y-0.5">
        <img className="mx-auto block h-12 sm:mx-0 sm:shrink-0" src="/dash_logo.png" alt=""/>
        <p className="text-lg font-semibold text-black">Dash Torrent Tracker (testnet)</p>
      </div>
    </NavLink>

  </div>
}
