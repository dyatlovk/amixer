class MixerTimer {
  private readonly TICK = 1000
  private started_: boolean = false
  private paused_: boolean = false
  private timer_: number = 0
  private interval_?: NodeJS.Timeout

  public start(callback?: Function): void {
    this.paused_ = false
    if (!this.started_) {
      this.run(callback)
    }
  }

  public pause(): number {
    this.paused_ = true
    return this.timer_
  }

  public resume(): number {
    this.paused_ = false
    return this.timer_
  }

  public stop(): number {
    this.started_ = false
    this.paused_ = false
    this.clear()
    this.reset()

    return 0
  }

  public reset(): void {
    this.timer_ = 0
  }

  public clear(): void {
    clearInterval(this.interval_)
  }

  public isPaused(): boolean {
    return this.paused_
  }

  public isStarted(): boolean {
    return this.started_
  }

  public get frame(): number {
    return this.timer_
  }

  private run(callback?: Function): void {
    if (this.paused_) return
    this.interval_ = setInterval(() => {
      if (!this.paused_) {
        this.timer_++
        if (callback) callback()
      }
    }, this.TICK)
    this.started_ = true
  }
}

export default MixerTimer
