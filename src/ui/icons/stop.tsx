import React, { FC, SVGAttributes } from 'react'
import styled from 'styled-components'

const StopIcon: FC<SVGAttributes<SVGElement>> = props => {
  return (
    <svg
      width="20px"
      height="20px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <StyledPath
        d="M16.875 4.31797V15.682C16.8746 15.9983 16.7488 16.3015 16.5251 16.5251C16.3015 16.7488 15.9983 16.8746 15.682 16.875H4.31797C4.0017 16.8746 3.6985 16.7488 3.47487 16.5251C3.25123 16.3015 3.12541 15.9983 3.125 15.682V4.31797C3.12541 4.0017 3.25123 3.6985 3.47487 3.47487C3.6985 3.25123 4.0017 3.12541 4.31797 3.125H15.682C15.9983 3.12541 16.3015 3.25123 16.5251 3.47487C16.7488 3.6985 16.8746 4.0017 16.875 4.31797Z"
        fill="#828282"
      />
    </svg>
  )
}

const StyledPath = styled.path`
  fill: ${({ theme }) => theme.disabled};
`

export { StopIcon }
