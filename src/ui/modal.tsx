import classNames from 'classnames'
import React, { useState } from 'react'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
  zIndex?: number
  visible: boolean
}

const Modal = (props: PropsWithChildren<Props>): JSX.Element => {
  const [isVisible, setVisible] = useState<boolean>(props.visible)

  return (
    <StyledModal
      className={classNames(props.className, 'modal', {
        visible: props.visible,
      })}
      $z={props.zIndex}
    >
      {props.children}
    </StyledModal>
  )
}

const StyledModal = styled.div<{ $z?: number }>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0;
  background-color: ${({ theme }) => theme.body};
  overflow: hidden;

  &.visible {
    z-index: 100;
    opacity: 1;
    overflow: auto;
  }
`

export default Modal
