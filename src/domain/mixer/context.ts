class AudioCtx {
  private ctx_: AudioContext
  constructor() {
    this.ctx_ = new AudioContext()
  }

  public get ctx(): AudioContext {
    return this.ctx_
  }
}

export default AudioCtx
