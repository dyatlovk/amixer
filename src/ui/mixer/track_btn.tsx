import classNames from 'classnames'
import React, { PropsWithChildren, useCallback, useState } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
  active?: boolean
  OnClick?: Function
  name: string
}

const TrackButton = (props: PropsWithChildren<Props>): JSX.Element => {
  const [isActive, setActive] = useState<boolean>(
    props.active ? props.active : false
  )

  const onTrackButton = useCallback(
    (e: any) => {
      // setActive(isActive => !isActive)
      if (props.OnClick) props.OnClick(e)
    },
    [isActive]
  )

  return (
    <StyledButton
      data-name={props.name}
      className={classNames('track_button', props.className, {
        active: props.active,
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
