import React, { useCallback } from 'react'
import styled from 'styled-components'
import Level from 'App/ui/level'
import Button from 'App/ui/button'
import Knob from 'App/ui/knob'

interface Props {
  onMixerClick?: Function
}

const Player = (props: Props): JSX.Element => {
  const onMuteClick = useCallback((e: any) => {}, [])

  return (
    <StyledPlayer className="player">
      <Button active={false} OnClick={onMuteClick} title="Mute" />
      <Level unitSize={4} gap={2} count={52} progress={15} />
      <Knob label="Vol" min={0} max={100} value={10} split={false} />
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
