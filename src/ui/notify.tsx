import classNames from 'classnames'
import React from 'react'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
}

const Notify = (props: PropsWithChildren<Props>): JSX.Element => {
  return (
    <StyledComponent className={classNames('notify', props.className)}>
      <div className="notify_body">{props.children}</div>
    </StyledComponent>
  )
}

const StyledComponent = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: ${({ theme }) => theme.body};
  position: absolute;
  left: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  .notify_body {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border: 1px solid ${({ theme }) => theme.border};
    text-transform: uppercase;
  }
`

export default Notify
