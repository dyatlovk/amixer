import { useAppContext } from 'App/app'
import TrackNode from 'App/domain/mixer/node'
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

  const onPlay = useCallback(
    async (e: any, id: string) => {
      const track = context.playlist.find(id)
      if (!track) return
      track.play()
    },
    [context.playlist]
  )

  const onPause = useCallback(
    (e: any, id: string) => {
      const track = context.playlist.find(id)
      if (!track) return
      track.pause(true)
    },
    [context.playlist]
  )

  const onStop = useCallback(
    (e: any, id: string) => {
      const track = context.playlist.find(id)
      if (!track) return
      track.stop()
    },
    [context.playlist]
  )

  const onMute = useCallback(
    (e: any, id: string, state: boolean) => {
      const track = context.playlist.find(id)
      if (!track) return
      const isMuted = !track.isMuted()
      track.mute = isMuted
    },
    [context.playlist]
  )

  const onLoop = useCallback(
    (e: any, id: string, state: boolean) => {
      const track = context.playlist.find(id)
      if (!track) return
      const st = track.isLooped()
      track.loop = !st
    },
    [context.playlist]
  )

  return (
    <>
      <Channels className={props.className}>
        {context.playlist.getAll().map((item: TrackNode, i: number) => {
          return (
            <Track
              key={i}
              id={item.id}
              nu={i + 1}
              title={item.title}
              url={item.url}
              pan={(Number(item.pan) * 100) as KnobPanRangeType}
              vol={(Number(item.vol) * 100) as KnobVolRangeType}
              master={{
                vol: (Number(context.playlist.vol) * 100) as knobVolRange,
                mute: context.playlist.mute,
              }}
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
