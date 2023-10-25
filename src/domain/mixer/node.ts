class TrackNode {
  private _vol: number = 0
  private _pan: number = 0
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

  /** track unique id */
  private _id: string

  /** track duration */
  private _duration: number = 0

  /** start from */
  private _start: number = 0

  constructor() {
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
    this.gainNode.gain.value = this._mute ? 0 : this._vol
    this.stereoPanNode = this.ctx.createStereoPanner()
    this.stereoPanNode.pan.value = this._pan
    trackSource
      .connect(this.gainNode)
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
    this.ctx = new AudioContext()
    const audioBuffer: AudioBuffer = await this.ctx.decodeAudioData(buffer)
    this.audioBuffer = audioBuffer
    this._duration = audioBuffer.duration
    const event = new CustomEvent('track:ready', { detail: this })
    document.dispatchEvent(event)
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

  public set vol(val: number) {
    if (!this.gainNode) return
    this.gainNode.gain.value = this._mute ? 0 : val
    this._vol = val
  }

  public get vol(): number {
    return this._vol
  }

  public set pan(val: number) {
    if (!this.stereoPanNode) return
    this.stereoPanNode.pan.value = val
    this._pan = val
  }

  public get pan(): number {
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
        this.gainNode.gain.value = this._vol
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
}

export default TrackNode
