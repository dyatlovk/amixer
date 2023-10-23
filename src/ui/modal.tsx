import classNames from 'classnames'
import React from 'react'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
  zIndex?: number
}

const Modal = (props: PropsWithChildren<Props>): JSX.Element => {
  return (
    <StyledModal
      className={classNames(props.className, 'modal')}
      z={props.zIndex}
    >
      {props.children}
    </StyledModal>
  )
}

const StyledModal = styled.div<{ z?: number }>`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: ${props => props.z};
  background-color: ${({ theme }) => theme.body};
`

export default Modal
