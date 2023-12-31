import TrackNode from 'App/domain/mixer/node'
import { durationFormatter } from 'App/domain/time/time'

class Playlist {
  private tracks: TrackNode[]
  private vol_: VolumeType = '0.1'
  private mute_: boolean = false

  constructor() {
    this.tracks = []
  }

  public add(track: TrackNode): void {
    this.tracks.push(track)
  }

  public remove(track: TrackNode): void {
    this.tracks = this.tracks.filter(item => item.id !== track.id)
  }

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
      item.volMaster = this.vol_
    })
  }

  /**
   * Check all tracks in playlist are not playing
   */
  public isIdle(): boolean {
    const stopped = this.tracks.filter((item, id) => {
      return !item.isPlay()
    })
    return stopped.length === this.count()
  }

  public set vol(val: VolumeType) {
    this.vol_ = val
  }

  public get vol(): VolumeType {
    return this.vol_
  }

  public set mute(val: boolean) {
    this.mute_ = val
  }

  public get mute(): boolean {
    return this.mute_
  }
}

export { Playlist }
