import { describe, expect, test } from '@jest/globals'
import { durationFormatter } from 'App/domain/time/time'

describe('time', () => {
  test('is 0', () => {
    expect(durationFormatter(0)).toEqual('--:--')
  })

  test('less 60', () => {
    expect(durationFormatter(32.0)).toEqual('00:32')
  })

  test('greater 60', () => {
    expect(durationFormatter(90)).toEqual('01:30')
  })

  test('minutes with lead 0', () => {
    expect(durationFormatter(60)).toEqual('01:00')
  })

  test('minutes without lead 0', () => {
    expect(durationFormatter(600)).toEqual('10:00')
  })
})
