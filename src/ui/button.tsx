import classNames from 'classnames'
import React, {
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from 'react'
import styled from 'styled-components'

interface Props {
  active: boolean
  className?: string
  OnClick: Function
  title: string
  icon?: ReactNode
}

const Button = (props: PropsWithChildren<Props>): JSX.Element => {
  const [isActive, setActive] = useState<boolean>(props.active)

  const onClick = useCallback((e: any) => {
    setActive(isActive => !isActive)
  }, [])

  return (
    <StyledButton
      className={classNames(props.className, 'button', { active: isActive })}
      onClick={e => {
        props.OnClick(e)
        onClick(e)
      }}
    >
      <div className="button_title">{props.title}</div>
      {props.icon && <div className="button_icon">{props.icon}</div>}
    </StyledButton>
  )
}

const StyledButton = styled.div`
  padding: 8px;
  min-height: 77px;
  min-width: 77px;
  box-sizing: border-box;
  text-align: center;
  align-items: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: fit-content;
  color: ${({ theme }) => theme.disabled};

  &.active {
    color: ${({ theme }) => theme.text};
  }

  .button_title {
    text-transform: uppercase;
    font-size: 10px;
  }

  .button_icon {
    margin-top: 10px;
  }

  &:hover {
  }
`

export default Button
