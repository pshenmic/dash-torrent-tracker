export default function TorrentListItem ({torrent}) {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {torrent.identifier}
      </th>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {torrent.name}
      </th>
      <td className="px-6 py-4">
        {torrent.description}
      </td>
      <td className="px-6 py-4">
        <a className={"hover:bg-sky-700"} href={torrent.magnet}>{torrent.magnet}</a>
      </td>
      <td className="px-6 py-4">
        {torrent.owner.identifier}
      </td>
      <td className="px-6 py-4">
        {new Date(torrent.timestamp).toLocaleString()}
      </td>
    </tr>
)
}
