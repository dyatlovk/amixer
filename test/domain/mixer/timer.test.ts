import { describe, expect, jest, test } from '@jest/globals'
import MixerTimer from 'App/domain/mixer/timer'

jest.useFakeTimers()
jest.spyOn(global, 'setInterval')

describe('timer', () => {
  test('start', () => {
    const timer = new MixerTimer()
    timer.start(() => {})
    expect(timer.isStarted()).toEqual(true)
    timer.stop()
    expect(timer.isStarted()).toEqual(false)
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000)
  })

  test('pause', () => {
    const timer = new MixerTimer()
    timer.start(() => {})
    expect(timer.isPaused()).toEqual(false)
    expect(timer.isStarted()).toEqual(true)
    timer.pause()
    expect(timer.isPaused()).toEqual(true)
    expect(timer.isStarted()).toEqual(true)
    timer.start()
    expect(timer.isPaused()).toEqual(false)
    expect(timer.isStarted()).toEqual(true)
    timer.stop()
  })

  test('frames', () => {
    const timer = new MixerTimer()
    expect(timer.frame).toEqual(0)
    timer.start(() => {})

    // fast forwarding to 1s
    jest.advanceTimersByTime(1000)
    expect(timer.frame).toEqual(1)

    // pause and fast forwarging
    timer.pause()
    jest.advanceTimersByTime(4000)
    expect(timer.frame).toEqual(1)

    timer.stop()
    expect(timer.frame).toEqual(0)
  })

  test('reset', () => {
    const timer = new MixerTimer()
    timer.start()
    jest.advanceTimersByTime(4000)
    timer.reset()
    expect(timer.frame).toEqual(0)
    timer.stop()
  })

  test('stop', () => {
    const timer = new MixerTimer()
    timer.start()
    jest.advanceTimersByTime(4000)
    timer.stop()
    expect(timer.frame).toEqual(0)
    expect(timer.isPaused()).toEqual(false)
    expect(timer.isStarted()).toEqual(false)
  })
})
