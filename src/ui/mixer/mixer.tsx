import { useAppContext } from 'App/app'
import { durationFormatter } from 'App/domain/time/time'
import Channels from 'App/ui/mixer/channels'
import Track from 'App/ui/mixer/track'
import React, { useCallback, useState } from 'react'

interface Props {
  className?: string
  onClose?: Function
}

const Mixer = (props: Props): JSX.Element => {
  const [context, setContext] = useState(useAppContext())

  const onPlay = useCallback(async (e: any, id: string) => {
    const track = context.playlist.find(id)
    if (!track) return
    track.play()
  }, [])

  const onPause = useCallback((e: any, id: string) => {
    const track = context.playlist.find(id)
    if (!track) return
    track.pause(true)
  }, [])

  const onStop = useCallback((e: any, id: string) => {
    const track = context.playlist.find(id)
    if (!track) return
    track.stop()
  }, [])

  const onMute = useCallback((e: any, id: string, state: boolean) => {
    const track = context.playlist.find(id)
    if (!track) return
    const isMuted = !track.isMuted()
    track.mute = isMuted
  }, [])

  const onLoop = useCallback((e: any, id: string, state: boolean) => {
    const track = context.playlist.find(id)
    if (!track) return
    const st = track.isLooped()
    track.loop = !st
  }, [])

  return (
    <>
      <Channels className={props.className}>
        {context.playlist.getAll().map((item, i) => {
          return (
            <Track
              key={i}
              id={item.id}
              nu={i + 1}
              title={item.title}
              url={item.url}
              pan={item.pan}
              vol={item.vol * 100}
              play={false}
              duration={durationFormatter(item.duration)}
              OnPlay={onPlay}
              OnStop={onStop}
              OnPause={onPause}
              OnMute={onMute}
              OnLoop={onLoop}
            />
          )
        })}
      </Channels>
    </>
  )
}

export default Mixer
