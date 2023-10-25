import { durationFormatter } from '../time/time'
import TrackNode from './node'

class Playlist {
  private tracks: TrackNode[]
  constructor() {
    this.tracks = []
  }

  public add(track: TrackNode): void {
    this.tracks.push(track)
  }

  public remove(track: TrackNode): void {}

  public clear(): void {
    this.tracks = []
  }

  public find(uuid: string): TrackNode | null {
    const found = this.tracks.find(el => el.id === uuid)
    if (!found) return null
    return found
  }

  public getAll(): TrackNode[] {
    return this.tracks
  }

  public count(): number {
    return this.tracks.length
  }

  public time(): string {
    let total = 0.0
    this.tracks.map((item, i) => {
      total += item.duration
    })
    return durationFormatter(total)
  }

  public preloadTracks(): void {
    let loaded = 0
    document.addEventListener('track:ready', e => {
      loaded++
      if (this.count() === loaded) {
        const event = new CustomEvent('playlist:loaded', {
          detail: { count: this.tracks.length, duration: this.time() },
        })
        document.dispatchEvent(event)
      }
    })

    this.tracks.map(async (item, id) => {
      const file = await item.loadFile()
      await item.decodeBuffer(file)
    })
  }
}

export { Playlist }
