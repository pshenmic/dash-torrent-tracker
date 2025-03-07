import CreateTorrent from '../components/CreateTorrent.jsx'
import TorrentTrackerHeader from '../components/TorrentTrackerHeader.jsx'

export function meta() {
  return [
    { title: "Add your torrent" },
    { name: "description", content: "Decentralized torrent tracker on a Dash Platform chain" },
  ];
}

export default function Home () {
  return <div className={"p-12"}>
    <TorrentTrackerHeader/>
    <CreateTorrent/>
  </div>
}
