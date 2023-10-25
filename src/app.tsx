import TrackNode from 'App/domain/mixer/node'
import { Playlist } from 'App/domain/mixer/playlist'
import Button from 'App/ui/button'
import { MixerIco } from 'App/ui/icons/mixer'
import { PlayIco } from 'App/ui/icons/play'
import Mixer from 'App/ui/mixer/mixer'
import Modal from 'App/ui/modal'
import Notify from 'App/ui/notify'
import Player from 'App/ui/player/player'
import { GlobalStyles } from 'Styles/global'
import { dark } from 'Styles/theme'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { AppState } from './@types/app'

enum States {
  Player = 0,
  Mixer = 1,
}

const playlist = new Playlist()
const track = new TrackNode()
track.vol = 0.2
track.pan = 20
track.url = 'https://freesound.org/data/previews/28/28239_129090-lq.mp3'
track.title = 'Birds'
playlist.add(track)

const track2 = new TrackNode()
track2.vol = 1.0
track2.url = 'https://freesound.org/data/previews/401/401978_7459817-lq.mp3'
track2.title = 'Ambient'
// playlist.add(track2)

const AppContext = createContext<AppState>({
  playlist: playlist,
})

export default function App(): JSX.Element {
  const [state, setState] = useState<States>(States.Player)
  const [notifyVisible, setNotifyVisible] = useState<boolean>(true)
  const [totalDuration, setTotalDuration] = useState<string>('')
  const [samplesLoaded, setSamplesLoaded] = useState<number>(0)
  const [maxSamples, setMaxSamples] = useState<number>(0)

  useEffect(() => {
    document.addEventListener('playlist:loaded', e => {
      setTotalDuration(e.detail.duration)
      setNotifyVisible(false)
    })

    let samples = 0
    document.addEventListener('track:ready', e => {
      samples++
      setSamplesLoaded(samples)
    })

    setMaxSamples(playlist.count())

    playlist.preloadTracks()
  }, [])

  const onMixerClick = useCallback((e: any) => {
    setState(States.Mixer)
  }, [])

  const onPlayerClick = useCallback((e: any) => {
    setState(States.Player)
  }, [])

  return (
    <ThemeProvider theme={dark}>
      <GlobalStyles />
      <AppContext.Provider value={{ playlist: playlist }}>
        <StyledPage className="app">
          {notifyVisible && (
            <Notify>
              samples: {samplesLoaded}/{maxSamples}
            </Notify>
          )}
          <section className="workspaceSection">
            <Player />
            <Modal visible={state === States.Mixer}>
              <Mixer />
            </Modal>
          </section>
          <section className="footerSection">
            <div className="stats stats_time">
              <span>Time</span>
              <span>{totalDuration}</span>
            </div>
            {state === States.Player && (
              <Button
                className="mixer-ico"
                active={true}
                OnClick={onMixerClick}
                icon={<MixerIco />}
                title="Mixer"
              />
            )}
            {state === States.Mixer && (
              <Button
                className="player-ico"
                active={true}
                OnClick={onPlayerClick}
                icon={<PlayIco />}
                title="Player"
              />
            )}
            <div className="stats stats_tracks">
              <span>Tracks</span>
              <span>{playlist.count()}</span>
            </div>
          </section>
        </StyledPage>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

const StyledPage = styled.div`
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  height: 100%;
  display: flex;
  flex-direction: column;

  .workspaceSection {
    flex-grow: 1;
    overflow-y: auto;
    position: relative;
  }

  .footerSection {
    gap: 14px;
    display: flex;
    justify-content: center;
    background-color: ${({ theme }) => theme.body};
  }

  .stats {
    box-sizing: border-box;
    padding-top: 15px;
    text-transform: uppercase;

    & > span {
      margin-right: 7px;
    }
  }

  .player-ico path,
  .mixer-ico path {
    fill: ${({ theme }) => theme.text};
  }
`
export function useAppContext(): AppState {
  return useContext(AppContext)
}
