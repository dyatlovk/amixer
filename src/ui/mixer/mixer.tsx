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
        <Track mute={true} play={true} nu={1} title="Wind" url="" pan={-20} vol={98} />
        <Track mute={true} nu={2} url="" title="Birds" pan={10} vol={30} />
        <Track loop={true} nu={3} url="" title="Woods" pan={0} vol={35} />
        <Track nu={4} url="" title="Ambient" />
        <Track nu={5} url="" title="Title" pan={10} vol={4} />
        <Track nu={6} url="" title="Title2" pan={-90} vol={10} />
        <Track nu={7} url="" title="Title3" pan={5} vol={71} />
        <Track nu={8} url="" title="Title4" pan={0} vol={0} />
      </Channels>
    </>
  )
}

export default Mixer
