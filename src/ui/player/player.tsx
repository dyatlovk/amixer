import { useAppContext } from 'App/app'
import { MixerAudio } from 'App/domain/audio/audio_api'
import Button from 'App/ui/button'
import Knob from 'App/ui/knob'
import Level from 'App/ui/level'
import React, { useCallback } from 'react'
import styled from 'styled-components'

interface Props {
  onMixerClick?: Function
}

const Player = (props: Props): JSX.Element => {
  const context = useAppContext()
  const onMuteClick = useCallback((e: any, state: boolean) => {
    const event = new CustomEvent('master:mute', { detail: { state: state } })
    document.dispatchEvent(event)
  }, [])

  const onVolChange = useCallback(
    (e: number, el: HTMLElement) => {
      const value = String(e / 100) as VolumeType
      context.playlist.vol = value
      const event = new CustomEvent('master:vol', {
        detail: { value: value, node: el },
      })
      document.dispatchEvent(event)
    },
    [context.playlist]
  )

  return (
    <StyledPlayer className="player">
      <Button active={false} OnClick={onMuteClick} title="Mute" />
      <Level unitSize={4} gap={2} count={52} progress={15} />
      <Knob
        label="Vol"
        min={0}
        max={100}
        value={MixerAudio.normalizeFromContext(context.playlist.vol)}
        split={false}
        OnChange={onVolChange}
      />
    </StyledPlayer>
  )
}

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
`

export default Player
