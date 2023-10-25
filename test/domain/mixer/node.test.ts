import { describe, expect, jest, test } from '@jest/globals'
import TrackNode from '../../../src/domain/mixer/node'

describe('audio_node', () => {
  test('uuid', () => {
    const track = new TrackNode()
    expect(typeof track.id).toBe('string')
  })

  test('default', () => {
    const track = new TrackNode()
    expect(track.vol).toEqual(0)
    expect(track.pan).toEqual(0)
    expect(track.mute).toEqual(false)
    expect(track.isPlay()).toEqual(false)
    expect(track.title).toEqual('')
    expect(track.loop).toEqual(false)
    expect(track.isPaused()).toEqual(false)
    expect(track.url).toEqual('')
  })
})
