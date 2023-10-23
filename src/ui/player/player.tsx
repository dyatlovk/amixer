import React, { useCallback } from 'react'
import styled from 'styled-components'
import Level from 'App/ui/level'
import Button from 'App/ui/button'
import KnobAlt from 'App/ui/knob_alt'

interface Props {
  onMixerClick?: Function
}

const Player = (props: Props): JSX.Element => {
  const onMuteClick = useCallback((e: any) => {}, [])
  const onMixerClick = useCallback((e: any) => {
    if (props.onMixerClick) props.onMixerClick(e)
  }, [])

  return (
    <StyledPlayer className="player">
      <Button onClick={onMuteClick} title="Mute" />
      <Level unitSize={4} gap={2} count={52} progress={15} />
      <KnobAlt label="Vol" min={0} max={100} value={10} split={false} />
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
