export class Torrent {
  name
  description
  magnet
  owner
  timestamp

  constructor (name, description, magnet, owner, timestamp) {
    this.name = name
    this.description = description
    this.magnet = magnet
    this.owner = owner
    this.timestamp = timestamp
  }
}
