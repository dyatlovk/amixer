import { MixerAudio } from '../audio/audio_api'
import Analyser from './analyser'
import AudioCtx from './context'
import MixerTimer from './timer'

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

  private ctx?: AudioContext
  private audioBuffer?: AudioBuffer
  private sourceNode?: AudioBufferSourceNode
  private gainNode?: GainNode
  private stereoPanNode?: StereoPannerNode
  private analyserNode?: Analyser

  /** track unique id */
  private _id: string

  /** track duration */
  private _duration: number = 0

  private _timer: MixerTimer

  constructor() {
    this._id = crypto.randomUUID()
    this._timer = new MixerTimer()
  }

  public async loadFile(): Promise<ArrayBuffer> {
    const re = await fetch(this.url)
    const buffer: ArrayBuffer = await re.arrayBuffer()
    const event = new CustomEvent('track:loaded', { detail: this })
    document.dispatchEvent(event)
    return buffer
  }

  public start(): void {
    if (!this.ctx) {
      this.ctx = this.makeContext()
    }

    this.sourceNode = this.registerNode()
    this.sourceNode.start(0)
    this._timer.start()
    const startEvent = new CustomEvent('track:play', {
      detail: { id: this._id, unpause: false },
    })

    document.dispatchEvent(startEvent)
    this.ctx.resume()
    this._play = true
  }

  public async decodeBuffer(buffer: ArrayBuffer): Promise<void> {
    if (!this.ctx) {
      this.ctx = this.makeContext()
    }
    const audioBuffer: AudioBuffer = await this.ctx.decodeAudioData(buffer)
    this.audioBuffer = audioBuffer
    this._duration = audioBuffer.duration
    const event = new CustomEvent('track:ready', { detail: this })
    document.dispatchEvent(event)
  }

  public registerNode(): AudioBufferSourceNode {
    if (!this.ctx) {
      this.ctx = this.makeContext()
    }
    if (!this.analyserNode) {
      this.analyserNode = this.makeAnalyser()
    }
    const trackSource = new AudioBufferSourceNode(this.ctx, {
      buffer: this.audioBuffer,
    })

    this.gainNode = this.ctx.createGain()
    this.gainNode.connect(this.ctx.destination)
    this.gainNode.gain.value = this._mute ? 0 : this.volInt
    this.stereoPanNode = this.ctx.createStereoPanner()
    this.stereoPanNode.pan.value = Number(this._pan)

    trackSource
      .connect(this.gainNode)
      .connect(this.analyserNode.node)
      .connect(this.stereoPanNode)
      .connect(this.ctx.destination)

    return trackSource
  }

  public get analyser(): Analyser {
    if (!this.analyserNode) {
      this.analyserNode = this.makeAnalyser()
    }
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

  public pause(val: boolean): void {
    if (!this.ctx) {
      this.ctx = this.makeContext()
    }
    if (val === true) {
      this._play = false
      this.ctx.suspend()
      this._timer.pause()
      const event = new CustomEvent('track:pause', {
        detail: { id: this._id, state: val },
      })
      document.dispatchEvent(event)
    }

    if (val === false) {
      this._play = true
      this.ctx.resume()
      this._timer.resume()
      const event = new CustomEvent('track:play', {
        detail: { id: this._id, unpause: true },
      })
      document.dispatchEvent(event)
    }

    this._pause = val
  }

  public isPaused(): boolean {
    return this._pause
  }

  public isStop(): boolean {
    return !this._pause && !this._play
  }

  public stop(): void {
    this._play = false
    this._pause = false
    this.ctx?.suspend()
    this.sourceNode?.stop()
    this._timer.stop()
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

  public get volInt(): number {
    return this.handleVol()
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

  public get time(): number {
    if (!this.ctx) {
      return 0
    }
    return this._timer.frame
  }

  public get source(): AudioBufferSourceNode | null {
    if (!this.sourceNode) return null
    return this.sourceNode
  }

  private OnEndCallback(e: any, context: this): void {
    const endEvent = new CustomEvent('track:end', {
      detail: { id: context._id },
    })
    document.dispatchEvent(endEvent)
    this.stop()
  }

  private handleVol(): number {
    const master: number = MixerAudio.normalizeFromContext(this._vol_master)
    const trackVol: number = MixerAudio.normalizeFromContext(this._vol)
    const vol = (master * trackVol) / 100
    return vol
  }

  private makeContext(): AudioContext {
    const c = new AudioCtx()
    return c.ctx
  }

  private makeAnalyser(): Analyser {
    if (!this.ctx) {
      this.ctx = this.makeContext()
    }
    return new Analyser(this.ctx)
  }
}

export default TrackNode
