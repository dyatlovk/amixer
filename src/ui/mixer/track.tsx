import { useAppContext } from 'App/app'
import { MixerAudio } from 'App/domain/audio/audio_api'
import MixerTimer from 'App/domain/mixer/timer'
import { durationFormatter } from 'App/domain/time/time'
import { useWindowSize } from 'App/hooks/useWindowSize'
import { InfinityIcon } from 'App/ui/icons/infinity'
import { PlayIco } from 'App/ui/icons/play'
import { StopIcon } from 'App/ui/icons/stop'
import Knob from 'App/ui/knob'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { PauseIco } from '../icons/pause'
import TrackButton from './track_btn'

interface Props {
  id: string
  url: string
  title: string
  nu: number
  pan?: KnobPanRangeType
  vol?: KnobVolRangeType
  mute?: boolean
  play?: boolean
  loop?: boolean
  duration: string
  master: {
    vol: KnobVolRangeType
    mute: boolean
  }
  OnPlay?: (e: any, id: string) => void
  OnPause?: (e: any, id: string) => void
  OnStop?: (e: any, id: string) => void
  OnEnd?: (e: any) => void
  OnMute?: (e: any, id: string, state: boolean) => void
  OnLoop?: (e: any, id: string, state: boolean) => void
}

const Default = {
  pan: 0,
  vol: 0,
  mute: false,
  play: false,
  loop: false,
}

const timer = new MixerTimer()

export default function Track(props: Props): JSX.Element {
  const [timerFrame, setTimerFrame] = useState<number>(0)
  const [context, setContext] = useState(useAppContext())
  const trackDom = useRef(null)
  const [stopActive, setStopActive] = useState<boolean>(
    props.play ? props.play : Default.play
  )

  const [playActive, setPlayActive] = useState<boolean>(
    props.play ? !props.play : !Default.play
  )
  const [playVisible, setPlayVisible] = useState<boolean>(
    props.play ? !props.play : !Default.play
  )

  const [pauseActive, setPauseActive] = useState<boolean>(
    props.play ? props.play : Default.play
  )
  const [pauseVisible, setPauseVisible] = useState<boolean>(
    props.play ? props.play : Default.play
  )

  const [loopActive, setLoopBtnActive] = useState<boolean>(
    props.loop ? props.loop : Default.loop
  )

  const [muteActive, setMuteActive] = useState<boolean>(
    props.mute ? !props.mute : !Default.mute
  )

  const ws = useWindowSize()

  function findPlayButton(): Element | null {
    if (!trackDom.current) return null
    const dom = trackDom.current as HTMLDivElement
    const playBtn = dom.getElementsByClassName('track_play')[0]
    return playBtn
  }

  const findTrackByDom = useCallback(
    (el: HTMLElement) => {
      const parent = el.closest('.track')
      if (!parent) return null
      const id = parent.getAttribute('data-id')
      if (!id) return null
      return context.playlist.find(id)
    },
    [context.playlist]
  )

  function findTrackByEvent(e: any): HTMLElement | null {
    const tr = e.target.closest('.track')
    if (!tr) return null
    return tr
  }

  const findTrackIdByEvent = useCallback((e: HTMLElement) => {
    const track = findTrackByEvent(e)
    if (!track) return ''
    const id = track.getAttribute('data-id')
    if (!id) return ''
    return id
  }, [])

  // track stop
  useEffect(() => {
    const callback = (e: any) => {
      const id = e.detail.id
      if (props.id !== id) return
      const track = context.playlist.find(id)
      setPlayActive(false)
      setPlayVisible(true)
      setStopActive(true)
      setPauseActive(false)
      setPauseVisible(false)
      if (!track) return
      if (track?.isPaused()) {
        e.stopPropagation()
        return
      }
      setTimerFrame(timer.stop())
      setTimerFrame(timer.frame)
    }
    document.addEventListener('track:stop', callback)
    return () => document.removeEventListener('track:stop', callback)
  }, [context.playlist, props.id])

  // track end
  useEffect(() => {
    const callback = (e: any) => {
      const id = e.detail.id
      if (props.id !== id) return
      const track = context.playlist.find(id)
      const playBtn = findPlayButton()
      if (track?.isPaused()) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      if (!track?.isLooped()) {
        track?.stop()
      } else {
        timer.reset()
        setTimerFrame(0)
      }

      if (props.OnEnd) props.OnEnd(playBtn)
    }
    document.addEventListener('track:end', callback)

    return () => document.removeEventListener('track:end', callback)
  }, [context.playlist, props])

  // track play
  useEffect(() => {
    const callback = (e: any) => {
      const id = e.detail.id
      if (props.id !== id) return
      const track = context.playlist.find(id)
      setPlayActive(false)
      setPlayVisible(false)
      setStopActive(true)
      setPauseActive(true)
      setPauseVisible(true)
      if (!track) return
      track.volMaster = context.playlist.vol
      if (track?.isPaused()) {
        e.stopPropagation()
        return
      }

      timer.start(() => {
        if (timer.frame >= track.duration) {
          timer.reset()
          setTimerFrame(0)
        }
        setTimerFrame(timer.frame)
      })
    }
    document.addEventListener('track:play', callback)
    return () => document.removeEventListener('track:play', callback)
  }, [context.playlist, props.id])

  // track pause
  useEffect(() => {
    const callback = (e: any) => {
      setPlayActive(true)
      setPlayVisible(true)
      setStopActive(true)
      setPauseActive(false)
      setPauseVisible(false)
      setTimerFrame(timer.pause())
    }

    document.addEventListener('track:pause', callback)

    return () => removeEventListener('track:pause', callback)
  }, [])

  // track mute
  useEffect(() => {
    const callback = (e: any) => {}

    document.addEventListener('track:mute', callback)
    return () => document.removeEventListener('track:mute', callback)
  }, [])

  // master vol
  useEffect(() => {
    const callback = (e: any) => {
      if (!trackDom.current) return

      const track = findTrackByDom(trackDom.current)
      if (!track) return
      track.volMaster = e.detail.value
    }

    document.addEventListener('master:vol', callback)
    return () => {
      document.removeEventListener('master:vol', callback)
    }
  }, [findTrackByDom])

  const onVolChange = useCallback(
    (val: number, el: any) => {
      const track = findTrackByDom(el)
      if (!track) return
      track.volMaster = context.playlist.vol
      track.vol = MixerAudio.normalizeFromVolUi(val)
    },
    [context.playlist.vol, findTrackByDom]
  )

  const onPanChange = useCallback(
    (val: number, el: any) => {
      const track = findTrackByDom(el)
      if (!track) return
      track.pan = MixerAudio.normalizeFromPanUi(val)
    },
    [findTrackByDom]
  )

  const onStopClick = useCallback(
    (e: any) => {
      const id = findTrackIdByEvent(e)
      if (props.OnStop) props.OnStop(e, id)
    },
    [findTrackIdByEvent, props]
  )

  const onPauseClick = useCallback(
    (e: any) => {
      const id = findTrackIdByEvent(e)
      if (props.OnPause) props.OnPause(e, id)
    },
    [findTrackIdByEvent, props]
  )

  const onPlayClick = useCallback(
    (e: any) => {
      const id = findTrackIdByEvent(e)
      if (props.OnPlay) props.OnPlay(e, id)
    },
    [findTrackIdByEvent, props]
  )

  const onLoopClick = useCallback(
    (e: any) => {
      const id = findTrackIdByEvent(e)
      setLoopBtnActive(loopBtnActive => !loopBtnActive)
      if (props.OnLoop) props.OnLoop(e, id, !loopActive)
    },
    [findTrackIdByEvent, loopActive, props]
  )

  const onMuteClick = useCallback(
    (e: any) => {
      const id = findTrackIdByEvent(e)
      setMuteActive(muteActive => !muteActive)
      if (props.OnMute) props.OnMute(e, id, muteActive)
    },
    [findTrackIdByEvent, muteActive, props]
  )

  return (
    <StyledTrack className="track" data-id={props.id} ref={trackDom}>
      <div className="track-left track-group">
        <div className="title track-title">{props.title}</div>
        <div className="track-control">
          <TrackButton
            name={'mute'}
            active={muteActive}
            visible={true}
            OnClick={onMuteClick}
            className="track_mute"
          >
            <span>{props.nu}</span>
          </TrackButton>

          <TrackButton
            name={'play'}
            visible={playVisible}
            active={playActive}
            OnClick={onPlayClick}
            className="track_play"
          >
            <PlayIco />
          </TrackButton>

          <TrackButton
            name={'pause'}
            visible={pauseVisible}
            active={pauseActive}
            OnClick={onPauseClick}
            className="track_pause"
          >
            <PauseIco />
          </TrackButton>

          <TrackButton
            name={'stop'}
            visible={true}
            active={stopActive}
            OnClick={onStopClick}
            className="track_stop"
          >
            <StopIcon />
          </TrackButton>

          <TrackButton
            name={'loop'}
            visible={true}
            active={loopActive}
            OnClick={onLoopClick}
            className="track_loop"
          >
            <InfinityIcon />
          </TrackButton>

          <TrackButton name={'time'} className="track_time">
            <span>Elp</span>
            <span>{durationFormatter(timerFrame)}</span>
          </TrackButton>

          {ws.width > 0 && ws.width >= 430 && (
            <TrackButton name={'total'} className="track_time">
              <span>Dur</span>
              <span>{props.duration}</span>
            </TrackButton>
          )}
        </div>
      </div>
      <div className="track-right track-group">
        <div className="pan">
          <Knob
            label="Pan"
            min={-100}
            max={100}
            value={props.pan ? props.pan : Default.pan}
            split={true}
            OnChange={onPanChange}
          />
        </div>
        <div className="vol">
          <Knob
            label="Vol"
            min={0}
            max={100}
            value={props.vol ? props.vol : Default.vol}
            split={false}
            OnChange={onVolChange}
          />
        </div>
      </div>
    </StyledTrack>
  )
}

const StyledTrack = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 8px 0;
  padding-right: 9px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 5px;
  min-height: 50px;
  align-content: center;
  justify-content: space-between;

  .track-group {
    display: flex;
  }

  .track-left {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .track-control {
    display: flex;
  }

  .track-title {
    line-height: 31px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .track_time {
    flex-direction: column;
    display: inline-flex;
  }

  .track_mute span {
    font-size: 11px;
    display: block;
    line-height: 1;
    padding: 3px 5px;
    border: 1px solid;
    border-radius: 1px;
  }
`
