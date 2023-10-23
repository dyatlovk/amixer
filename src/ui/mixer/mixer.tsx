import React from 'react'
import Channels from './channels'
import Track from './track'

interface Props {
  className?: string
  onClose?: Function
}

const Mixer = (props: Props): JSX.Element => {
  return (
    <>
      <Channels className={props.className}>
        <Track nu={1} title="Wind" url="" />
        <Track nu={2} url="" title="Birds" />
        <Track nu={3} url="" title="Woods" />
        <Track nu={4} url="" title="Ambient" />
        <Track nu={5} url="" title="Title" />
        <Track nu={6} url="" title="Title2" />
        <Track nu={7} url="" title="Title3" />
        <Track nu={8} url="" title="Title4" />
      </Channels>
    </>
  )
}

export default Mixer
