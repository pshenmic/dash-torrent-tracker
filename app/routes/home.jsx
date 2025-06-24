import TorrentList from '../components/TorrentList.jsx'

export function meta() {
  return [
    { title: "Dash Torrents Tracker" },
    { name: "description", content: "Decentralized torrent tracker on a Dash Platform chain" },
  ];
}

export default function Home () {
  return <TorrentList/>
}
