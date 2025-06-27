import TorrentList from '../components/TorrentList.jsx'
import TorrentTrackerHeader from '../components/TorrentTrackerHeader.jsx'
import { useOutletContext } from 'react-router'

export function meta() {
  return [
    { title: "Dash Torrents Tracker" },
    { name: "description", content: "Decentralized torrent tracker on a Dash Platform chain" },
  ];
}

export default function Home ({}) {
  const {walletInfo} = useOutletContext();

  return <div>
    {/* Header Section */}
    <TorrentList walletInfo={walletInfo}/>
  </div>
}
