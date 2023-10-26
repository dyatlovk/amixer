import { MixerAudio } from '../audio/audio_api'
import Analyser from './analyser'

class TrackNode {
  private _vol: VolumeType = '0.0'
  private _vol_master: VolumeType = '0.0'
  private _pan: PanType = '0.0'
  private _mute: boolean = false
  private _play: boolean = false
  private _title: string = ''
  private _loop: boolean = false
  private _pause: boolean = false
  private _url: string = ''

  private ctx: AudioContext
  private audioBuffer?: AudioBuffer
  private sourceNode?: AudioBufferSourceNode
  private gainNode?: GainNode
  private stereoPanNode?: StereoPannerNode
  private analyserNode: Analyser

  /** track unique id */
  private _id: string

  /** track duration */
  private _duration: number = 0

  /** start from */
  private _start: number = 0

  constructor() {
    this.ctx = new AudioContext()
    this.analyserNode = new Analyser(this.ctx)
    this._id = crypto.randomUUID()
  }

  public async loadFile(): Promise<ArrayBuffer> {
    const re = await fetch(this.url)
    const buffer: ArrayBuffer = await re.arrayBuffer()
    const event = new CustomEvent('track:loaded', { detail: this })
    document.dispatchEvent(event)
    return buffer
  }

  public play(): void {
    this._pause = false
    if (this._play) {
      const startEvent = new CustomEvent('track:play', {
        detail: { id: this._id },
      })
      document.dispatchEvent(startEvent)
      return
    }
    const trackSource = new AudioBufferSourceNode(this.ctx, {
      buffer: this.audioBuffer,
    })
    this.sourceNode = trackSource

    this.sourceNode.onended = () => {
      const endEvent = new CustomEvent('track:end', {
        detail: { id: this._id },
      })
      document.dispatchEvent(endEvent)
    }

    this.gainNode = this.ctx.createGain()
    this.gainNode.connect(this.ctx.destination)
    this.gainNode.gain.value = this._mute ? 0 : Number(this._vol)
    this.stereoPanNode = this.ctx.createStereoPanner()
    this.stereoPanNode.pan.value = Number(this._pan)

    trackSource
      .connect(this.gainNode)
      .connect(this.analyserNode.node)
      .connect(this.stereoPanNode)
      .connect(this.ctx.destination)
    trackSource.start(0, this._start)
    const startEvent = new CustomEvent('track:play', {
      detail: { id: this._id },
    })
    document.dispatchEvent(startEvent)
    this._play = true
  }

  public async decodeBuffer(buffer: ArrayBuffer): Promise<void> {
    // this.ctx = new AudioContext()
    const audioBuffer: AudioBuffer = await this.ctx.decodeAudioData(buffer)
    this.audioBuffer = audioBuffer
    this._duration = audioBuffer.duration
    const event = new CustomEvent('track:ready', { detail: this })
    document.dispatchEvent(event)
  }

  public get analyser(): Analyser {
    return this.analyserNode
  }

  public disconnect(): boolean {
    this.sourceNode?.stop()
    this.sourceNode?.disconnect()

    return true
  }

  public isPlay(): boolean {
    return this._play
  }

  public get duration(): number {
    return this._duration
  }

  public pause(val: boolean) {
    if (val) {
      this._play = false
      this.sourceNode?.stop()
      this._start = this.ctx.currentTime
      const event = new CustomEvent('track:pause', {
        detail: { id: this._id, state: val },
      })
      document.dispatchEvent(event)
    }

    if (!val) {
      this._play = true
      this.sourceNode?.start(0, this._start)
      const event = new CustomEvent('track:play', {
        detail: { id: this._id, state: val },
      })
      document.dispatchEvent(event)
    }

    this._pause = val
  }

  public isPaused(): boolean {
    return this._pause
  }

  public stop(): void {
    this.sourceNode?.stop()
    this._start = 0
    this._play = false
    this._pause = false
    const endEvent = new CustomEvent('track:stop', {
      detail: { id: this._id },
    })
    document.dispatchEvent(endEvent)
  }

  public get id(): string {
    return this._id
  }

  public set vol(val: VolumeType) {
    this._vol = val
    if (!this.gainNode) return
    this.gainNode.gain.value = this._mute ? 0 : this.handleVol()
  }

  public get vol(): VolumeType {
    return this._vol
  }

  public set volMaster(val: VolumeType) {
    this._vol_master = val
    if (!this.gainNode) return
    this.gainNode.gain.value = this._mute ? 0 : this.handleVol()
  }

  public set pan(val: PanType) {
    this._pan = val
    if (!this.stereoPanNode) return
    this.stereoPanNode.pan.value = Number(val)
  }

  public get pan(): PanType {
    return this._pan
  }

  public set mute(val: boolean) {
    if (val) {
      if (this.gainNode) {
        this.gainNode.gain.value = 0
      }
    }

    if (!val) {
      if (this.gainNode) {
        this.gainNode.gain.value = this.handleVol()
      }
    }
    const event = new CustomEvent('track:mute', {
      detail: { id: this._id, state: val },
    })
    document.dispatchEvent(event)
    this._mute = val
  }

  public get mute(): boolean {
    return this._mute
  }

  public isMuted(): boolean {
    return this._mute === true
  }

  public set title(val: string) {
    this._title = val
  }

  public get title(): string {
    return this._title
  }

  public set loop(val: boolean) {
    if (!this.sourceNode) return
    this.sourceNode.loop = val
    this._loop = val
  }

  public get loop(): boolean {
    return this._loop
  }

  public isLooped(): boolean {
    return this._loop
  }

  public set url(val: string) {
    this._url = val
  }

  public get url(): string {
    return this._url
  }

  private handleVol(): number {
    const master: number = MixerAudio.normalizeFromContext(this._vol_master)
    const trackVol: number = MixerAudio.normalizeFromContext(this._vol)
    const vol = (master * trackVol) / 100
    // if (!this.gainNode) return 0
    // this.gainNode.gain.value = Number(vol)
    return vol
  }
}

export default TrackNode
