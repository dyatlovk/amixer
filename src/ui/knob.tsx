import SvgKnob from 'Lib/svg-knob'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

interface Props {
  label: string
  min: number
  max: number
  value: number
  split: boolean
  OnChange?: (e: number, el: HTMLElement) => void
}

const Knob = (props: Props): JSX.Element => {
  let el: HTMLDivElement | null = null
  const isCalled = useRef(false)

  useEffect(() => {
    if (isCalled.current) return
    isCalled.current = true

    SvgKnob(el, {
      initial_value: props.value,
      center_zero: props.split,
      value_min: props.split ? props.min : 0.0,
      value_max: props.split ? props.max : 100.0,
      onchange: (e: number, el: HTMLElement) => {
        if (props.OnChange) props.OnChange(e, el)
      },
    })
  }, [el, props])

  return (
    <StyledKnob className="knob">
      <div className="knob-label">{props.label}</div>
      <div ref={elem => (el = elem)} className="knob-circle"></div>
    </StyledKnob>
  )
}

const StyledKnob = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 8px 5px;

  .knob-track-bg {
    stroke: ${({ theme }) => theme.disabled};
  }

  .knob-circle {
    width: 40px;
    height: 100%;
    position: relative;
  }

  .knob-label {
    margin-bottom: 8px;
    text-transform: uppercase;
    line-height: 1;
  }

  .knob-value {
    fill: ${({ theme }) => theme.text};
  }

  .knob-cursor {
    stroke: ${({ theme }) => theme.accent};
  }

  .knob-track {
    stroke: ${({ theme }) => theme.accent};
  }
`
export default Knob
