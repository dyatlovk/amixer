import classNames from 'classnames'
import React from 'react'
import styled from 'styled-components'

interface Props {
  unitSize: number
  gap: number
  count: number
  progress: number
  className?: string
}

const Level = (props: Props): JSX.Element => {
  const activeUnits = findProgress(props.count, props.progress)
  const units = Array.from(Array(props.count).keys()).reverse()

  return (
    <LevelStyles
      $size={props.unitSize}
      $gap={props.gap}
      className={classNames('level', props.className)}
    >
      {units.map((x, i) => (
        <div
          key={x}
          data-id={x}
          className={classNames('level_unit', { active: activeUnits > x })}
        ></div>
      ))}
    </LevelStyles>
  )
}

function findProgress(total: number, progress: number): number {
  return (total / 100) * progress
}

const LevelStyles = styled.div<{ $size?: number; $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.$gap}px;
  width: 56px;
  padding: 8px 26px;
  box-sizing: border-box;
  margin-bottom: 13px;

  .level_unit {
    width: ${props => props.$size}px;
    height: ${props => props.$size}px;
    background-color: ${({ theme }) => theme.disabled};

    &.active {
      background-color: ${({ theme }) => theme.accent};
    }
  }
`

export default Level
