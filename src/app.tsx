import TrackNode from 'App/domain/mixer/node'
import { Playlist } from 'App/domain/mixer/playlist'
import useThemeDetector, { Themes } from 'App/hooks/useTheme'
import Button from 'App/ui/button'
import { MixerIco } from 'App/ui/icons/mixer'
import { PlayIco } from 'App/ui/icons/play'
import Mixer from 'App/ui/mixer/mixer'
import Modal from 'App/ui/modal'
import Notify from 'App/ui/notify'
import Player from 'App/ui/player/player'
import { GlobalStyles } from 'Styles/global'
import { dark, scheme } from 'Styles/theme'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled, { ThemeProvider } from 'styled-components'

enum States {
  Player = 0,
  Mixer = 1,
}

const playlist = new Playlist()
const track = new TrackNode()
track.vol = '0.1'
track.pan = '0.2'
track.url = 'birds.mp3'
track.title = 'Birds'
playlist.add(track)

const track2 = new TrackNode()
track2.vol = '0.1'
track2.url = 'ambient.mp3'
track2.title = 'Ambient'
playlist.add(track2)

const track3 = new TrackNode()
track3.vol = '0.1'
track3.pan = '-0.1'
track3.url = 'trees.mp3'
track3.title = 'Wind trees'
playlist.add(track3)

const AppContext = createContext<AppState>({
  playlist: playlist,
})

export default function App(): JSX.Element {
  const [state, setState] = useState<States>(States.Mixer)
  const [notifyVisible, setNotifyVisible] = useState<boolean>(true)
  const [totalDuration, setTotalDuration] = useState<string>('')
  const [samplesLoaded, setSamplesLoaded] = useState<number>(0)
  const [maxSamples, setMaxSamples] = useState<number>(0)
  const [theme, setTheme] = useState<Object>(dark)
  const isTrackReadyCalled = useRef(false)
  const isPlaylistCalled = useRef(false)

  const th = useThemeDetector()
  useEffect(() => {
    if (th === Themes.Dark) {
      setTheme(dark)
    }
    if (th === Themes.Light) {
      setTheme(scheme)
    }
  }, [th])

  // playlist loaded
  useEffect(() => {
    const callback = (e: any) => {
      if (isPlaylistCalled.current) return
      isPlaylistCalled.current = true
      setTotalDuration(e.detail.duration)
      setNotifyVisible(false)
    }

    document.addEventListener('playlist:loaded', callback)

    return () => document.removeEventListener('playlist:loaded', callback)
  }, [])

  // track ready
  useEffect(() => {
    let samples = 0
    const callback = (e: any) => {
      samples++
      setSamplesLoaded(samples)
    }

    document.addEventListener('track:ready', callback)

    setMaxSamples(playlist.count())

    playlist.preloadTracks()

    return () => {
      document.removeEventListener('track:ready', callback)
      samples = 0
    }
  }, [])

  const onMixerClick = useCallback((e: any) => {
    setState(States.Mixer)
  }, [])

  const onPlayerClick = useCallback((e: any) => {
    setState(States.Player)
  }, [])

  return (
    <ThemeProvider theme={theme}>
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
    gap: 7px;
    display: flex;
    justify-content: center;
    background-color: ${({ theme }) => theme.body};
  }

  .stats {
    box-sizing: border-box;
    padding-top: 17px;
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
