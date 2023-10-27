import { describe, expect, test } from '@jest/globals'
import TrackNode from 'App/domain/mixer/node'
import { Playlist } from 'App/domain/mixer/playlist'

// jest.mock('App/domain/mixer/node')

describe('playlist', () => {
  test('init', () => {
    const pl = new Playlist()
    expect(pl.count()).toEqual(0)
  })

  test('add track', () => {
    const track = new TrackNode()
    const track2 = new TrackNode()
    const pl = new Playlist()
    pl.add(track)
    pl.add(track2)
    expect(pl.count()).toEqual(2)
  })

  test('find track', () => {
    const track = new TrackNode()
    const track2 = new TrackNode()
    const pl = new Playlist()
    pl.add(track)
    pl.add(track2)
    const found = pl.find(track2.id)
    if (!found) {
      expect(found).toBeDefined()
      return
    }
    expect(found.id).toEqual(track2.id)
  })

  test('search undefined track', () => {
    const track = new TrackNode()
    const pl = new Playlist()
    pl.add(track)
    const found = pl.find('bad id')
    expect(found).toBeNull()
  })

  test('clear', () => {
    const track = new TrackNode()
    const pl = new Playlist()
    pl.add(track)
    pl.clear()
    expect(pl.count()).toEqual(0)
  })

  test('remove', () => {
    const track = new TrackNode()
    const pl = new Playlist()
    pl.add(track)
    pl.remove(track)
    expect(pl.count()).toEqual(0)
  })

  test('time', () => {
    const track = new TrackNode()
    const pl = new Playlist()
    pl.add(track)
    expect(pl.time()).toStrictEqual('--:--')
  })

  test('idle', () => {
    const pl = new Playlist()
    expect(pl.isIdle()).toEqual(true)
  })

  test('vol', () => {
    const pl = new Playlist()
    pl.vol = '0.61'
    expect(pl.vol).toEqual('0.61')
  })

  test('mute', () => {
    const pl = new Playlist()
    expect(pl.mute).toEqual(false)
    pl.mute = true
    expect(pl.mute).toEqual(true)
  })
})
