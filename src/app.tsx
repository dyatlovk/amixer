import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from 'Styles/global'
import { dark, scheme } from 'Styles/theme'
import Player from 'App/ui/player/player'
import Button from 'App/ui/button'
import { MixerIco } from 'App/ui/icons/mixer'
import Mixer from 'App/ui/mixer/mixer'
import { PlayIco } from 'App/ui/icons/play'
import Modal from 'App/ui/modal'

enum States {
  Player = 0,
  Mixer = 1,
}

export default function App(): JSX.Element {
  const [state, setState] = useState<States>(States.Player)

  const onMixerClick = useCallback((e: any) => {
    setState(States.Mixer)
  }, [])

  const onPlayerClick = useCallback((e: any) => {
    setState(States.Player)
  }, [])

  return (
    <ThemeProvider theme={dark}>
      <GlobalStyles />
      <StyledPage className="app">
        <section className="workspaceSection">
          <Player />
          <Modal visible={state === States.Mixer}>
            <Mixer />
          </Modal>
        </section>
        <section className="footerSection">
          <div className="stats stats_time">
            <span>Time</span>
            <span>10:28</span>
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
            <span>14</span>
          </div>
        </section>
      </StyledPage>
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
