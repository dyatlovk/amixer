import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

interface Props {
  className?: string
}

export default function Channels(props: PropsWithChildren<Props>): JSX.Element {
  return (
    <StyledChannels className={classNames('channels', props.className)}>
      {props.children}
    </StyledChannels>
  )
}

const StyledChannels = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
`
