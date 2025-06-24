import CreateTorrent from '../components/CreateTorrent.jsx'
import TorrentTrackerHeader from '../components/TorrentTrackerHeader.jsx'
import { NavLink } from 'react-router'

export function meta() {
  return [
    { title: "Add your torrent - Dash Torrent Tracker" },
    { name: "description", content: "Add a new torrent to the decentralized Dash Platform chain" },
  ];
}

export default function AddTorrent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TorrentTrackerHeader/>
            <NavLink to="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to list
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateTorrent/>
      </div>
    </div>
  )
}
