import { useEffect, useState } from 'react'
import * as PEApi from '../utils/Api'
import { Torrent } from '../models/Torrent.js'
import TorrentListItem from './TorrentListItem.jsx'
import TorrentTrackerHeader from './TorrentTrackerHeader.jsx'
import { NavLink } from 'react-router'

export default function TorrentList () {
  const [torrents, setTorrents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    PEApi.getDocumentsByDataContract('6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5')
      .then(result => {
        const { resultSet } = result

        setTorrents(resultSet.map(document => {
          if(!document.data) {
            return null
          }

          const data = JSON.parse(document.data)
          const owner = document.owner
          const timestamp = document.timestamp
          const { magnet, name, description } = data

          return new Torrent(name, description, magnet, owner, timestamp)
        }).filter(e => !!e))
      })
      .catch((e) => setError(e.toString()))
      .finally(() => setLoading(false))
  }, [])

  return <div className="max-w-full space-y-6 px-12">
    <div className="flex sm:flex-row sm:items-center justify-between sm:gap-6 sm:py-4">
      <TorrentTrackerHeader/>
      <NavLink to="/add" end>
        <button
          className="space-y-2 text-center sm:text-left rounded-4xl bg-sky-500 hover:text-brown text-center p-3 m-12">
          Add your torrent
        </button>
      </NavLink>
    </div>
    {
      loading ?
        <div className="flex flex-col gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <div className="space-y-0.5">
              <p className="text-lg text-black">The list of available torrents is loading, please wait</p>
            </div>
          </div>
        </div>
        : <div/>
    }
    {!loading && !error ? <div
      className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md bg-clip-border">
      <table className="w-full text-left table-auto min-w-max text-slate-800">
        <thead>
        <tr className="text-slate-500 border-b border-slate-300 bg-slate-50">
          <th className="p-4">
            <p className="text-sm leading-none font-normal">
              Name
            </p>
          </th>
          <th className="p-4">
            <p className="text-sm leading-none font-normal">
              Description
            </p>
          </th>
          <th className="p-4">
            <p className="text-sm leading-none font-normal">
              Magnet Link
            </p>
          </th>
          <th className="p-4">
            <p className="text-sm leading-none font-normal">
              Owner
            </p>
          </th>
          <th className="p-4">
            <p className="text-sm leading-none font-normal">
              Timestamp
            </p>
          </th>
        </tr>
        </thead>
        <tbody>
        {torrents.map((torrent, index) => <TorrentListItem key={index} torrent={torrent}/>)}
        </tbody>
      </table>
    </div> : <div/>}

    {error ? <div className={"leading-none font-normal text-lg pt-12"}>Error during submit: {error}</div> : <div/>}
  </div>

}
