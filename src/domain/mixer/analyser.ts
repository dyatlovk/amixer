class Analyser {
  private node_: AnalyserNode
  private ctx_: AudioContext
  private buffer_len_: number = 0
  private data_arr_: Uint8Array

  constructor(ctx: AudioContext) {
    this.ctx_ = ctx
    this.node_ = ctx.createAnalyser()
    this.node_.fftSize = 2048

    this.buffer_len_ = this.node_.frequencyBinCount
    this.data_arr_ = new Uint8Array(this.buffer_len_)
    this.node_.getByteTimeDomainData(this.data_arr_)
  }

  public get node(): AnalyserNode {
    return this.node_
  }

  public update(): void {
    this.node_.getByteTimeDomainData(this.data_arr_)
  }

  public get bufferLen(): number {
    return this.buffer_len_
  }

  public get data(): Uint8Array {
    return this.data_arr_
  }
}

export default Analyser
