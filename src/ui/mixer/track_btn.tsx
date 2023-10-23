import classNames from 'classnames'
import React, { PropsWithChildren, useCallback, useState } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
}

const TrackButton = (props: PropsWithChildren<Props>): JSX.Element => {
  const [isActive, setActive] = useState<boolean>(false)

  const onTrackButton = useCallback((e: any) => {
    setActive(isActive => !isActive)
  }, [])

  return (
    <StyledButton
      className={classNames('track_button', props.className, {
        active: isActive,
      })}
      onClick={onTrackButton}
    >
      {props.children}
    </StyledButton>
  )
}

const StyledButton = styled.div`
  width: 50px;
  height: 41px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.disabled};
  text-transform: uppercase;

  &.active {
    color: ${({ theme }) => theme.accent};
    path {
      fill: ${({ theme }) => theme.accent};
    }
  }

  path {
    fill: ${({ theme }) => theme.disabled};
  }
`

export default TrackButton
