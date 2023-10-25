import classNames from 'classnames'
import React, { PropsWithChildren, useCallback, useState } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
  active?: boolean
  OnClick?: Function
  name: string
  visible?: boolean
}

const TrackButton = (props: PropsWithChildren<Props>): JSX.Element => {
  const [isActive, setActive] = useState<boolean>(
    props.active ? props.active : false
  )
  const [isVisible, setVisible] = useState<boolean>(
    props.visible ? props.visible : true
  )

  const onTrackButton = useCallback(
    (e: any) => {
      if (props.OnClick) props.OnClick(e)
    },
    [isActive]
  )

  return (
    <StyledButton
      data-name={props.name}
      className={classNames('track_button', props.className, {
        active: props.active,
        visible: props.visible,
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
  display: none;
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

  &.visible {
    display: flex;
  }

  path {
    fill: ${({ theme }) => theme.disabled};
  }
`

export default TrackButton
