import CreateTorrent from '../components/CreateTorrent.jsx'
import TorrentTrackerHeader from '../components/TorrentTrackerHeader.jsx'
import { NavLink, useOutletContext } from 'react-router'

export function meta () {
  return [
    { title: 'Add your torrent - Dash Torrent Tracker' },
    { name: 'description', content: 'Add a new torrent to the decentralized Dash Platform chain' },
  ]
}

export default function AddTorrent ({}) {
  const {walletInfo} = useOutletContext();

  return (
    <div>
      <CreateTorrent walletInfo={walletInfo}/>
    </div>
  )
}
