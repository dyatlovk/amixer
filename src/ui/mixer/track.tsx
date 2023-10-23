import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { PlayIco } from 'App/ui/icons/play'
import { InfinityIcon } from 'App/ui/icons/infinity'
import { StopIcon } from 'App/ui/icons/stop'
import Knob from 'App/ui/knob'
import { useWindowSize } from 'App/hooks/useWindowSize'
import TrackButton from './track_btn'
import { PauseIco } from '../icons/pause'

interface Props {
  url: string
  title: string
  nu: number
  pan?: number
  vol?: number
  mute?: boolean
  play?: boolean
  loop?: boolean
}

const Default = {
  pan: 0,
  vol: 0,
  mute: false,
  play: false,
  loop: false,
}

export default function Track(props: Props): JSX.Element {
  const [stopBtnActive, setStopBtnActive] = useState<boolean>(
    props.play ? !props.play : !Default.play
  )

  const [playBtnActive, setPlayBtnActive] = useState<boolean>(
    props.play ? props.play : Default.play
  )

  const [pauseBtnActive, setPauseBtnActive] = useState<boolean>(
    props.play ? props.play : Default.play
  )

  const [loopBtnActive, setLoopBtnActive] = useState<boolean>(
    props.loop ? props.loop : Default.loop
  )

  const [muteBtnActive, setMuteBtnActive] = useState<boolean>(
    props.mute ? !props.mute : !Default.mute
  )

  const ws = useWindowSize()

  const onBtnClick = useCallback(
    (e: any) => {
      const btn = e.target.closest('.track_button')
      const name = btn.getAttribute('data-name')
      if (name === 'play') {
        setPlayBtnActive(true)
        setStopBtnActive(false)
        setPauseBtnActive(pauseBtnActive => !pauseBtnActive)
      }
      if (name === 'stop') {
        setPlayBtnActive(false)
        setStopBtnActive(true)
        setPauseBtnActive(false)
      }

      if (name === 'loop') {
        setLoopBtnActive(loopBtnActive => !loopBtnActive)
      }

      if (name === 'mute') {
        setMuteBtnActive(muteBtnActive => !muteBtnActive)
      }
    },
    [stopBtnActive, playBtnActive]
  )

  return (
    <StyledTrack className="track" data-id={props.nu}>
      <div className="track-left track-group">
        <div className="title track-title">{props.title}</div>
        <div className="track-control">
          <TrackButton
            name={'mute'}
            active={muteBtnActive}
            OnClick={onBtnClick}
            className="track_mute"
          >
            {props.nu}
          </TrackButton>

          <TrackButton
            name={'play'}
            active={playBtnActive}
            OnClick={onBtnClick}
            className="track_play"
          >
            {!pauseBtnActive && <PlayIco />}
            {pauseBtnActive && <PauseIco />}
          </TrackButton>

          <TrackButton
            name={'stop'}
            active={stopBtnActive}
            OnClick={onBtnClick}
            className="track_stop"
          >
            <StopIcon />
          </TrackButton>

          <TrackButton
            name={'loop'}
            active={loopBtnActive}
            OnClick={onBtnClick}
            className="track_loop"
          >
            <InfinityIcon />
          </TrackButton>

          <TrackButton name={'time'} className="track_time">
            <span>Time</span>
            <span>--:--</span>
          </TrackButton>

          {ws.width > 0 && ws.width >= 430 && (
            <TrackButton name={'total'} className="track_time">
              <span>Total</span>
              <span>--:--</span>
            </TrackButton>
          )}
        </div>
      </div>
      <div className="track-right track-group">
        <div className="pan">
          <Knob
            label="Pan"
            min={-50}
            max={50}
            value={props.vol ? props.vol : Default.vol}
            split={true}
          />
        </div>
        <div className="vol">
          <Knob
            label="Vol"
            min={0}
            max={100}
            value={props.pan ? props.pan : Default.pan}
            split={false}
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

  .track_mute {
    font-size: 12px;
  }
`
