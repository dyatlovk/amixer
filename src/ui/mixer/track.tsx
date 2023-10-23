import React from 'react'
import styled from 'styled-components'
import { PlayIco } from 'App/ui/icons/play'
import { InfinityIcon } from 'App/ui/icons/infinity'
import { StopIcon } from 'App/ui/icons/stop'
import KnobAlt from 'App/ui/knob_alt'
import { useWindowSize } from 'App/hooks/useWindowSize'

interface Props {
  url: string
  title: string
  nu: number
}

export default function Track(props: Props): JSX.Element {
  const ws = useWindowSize()

  return (
    <StyledTrack className="track" data-id={props.nu}>
      <div className="track-left track-group">
        <div className="title track-title">{props.title}</div>
        <div className="track-control">
          <div className="mute track-button">{props.nu}</div>
          <div className="play track-button">
            <PlayIco />
          </div>
          <div className="stop track-button">
            <StopIcon />
          </div>
          <div className="loop track-button">
            <InfinityIcon />
          </div>
          <div className="track_time">
            <span>Time</span>
            <span>01:18</span>
          </div>

          {ws.width > 0 && ws.width >= 430 && (
            <div className="track_time">
              <span>Total</span>
              <span>10:29</span>
            </div>
          )}
        </div>
      </div>
      <div className="track-right track-group">
        <div className="pan">
          <KnobAlt label="Pan" min={-50} max={50} value={20} split={true} />
        </div>
        <div className="vol">
          <KnobAlt label="Vol" min={0} max={100} value={70} split={false} />
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

  .track-button {
    width: 50px;
    height: 41px;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
  }

  .track_time {
    flex-direction: column;
    text-align: center;
    text-transform: uppercase;
    width: 50px;
    height: 41px;
    display: inline-flex;
    justify-content: center;
  }

  .mute {
    font-size: 12px;
  }
`
