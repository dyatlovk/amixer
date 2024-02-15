import React, { FC, SVGAttributes } from 'react'
import styled from 'styled-components'

const PlayIco: FC<SVGAttributes<SVGElement>> = props => {
  return (
    <svg
      width="20px"
      height="20px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <StyledPath
        d="M18.75 10C18.7505 10.2122 18.6961 10.421 18.5921 10.6059C18.488 10.7909 18.3379 10.9457 18.1562 11.0555L6.9 17.9414C6.71022 18.0576 6.49287 18.1211 6.27037 18.1252C6.04788 18.1293 5.82832 18.074 5.63438 17.9649C5.44227 17.8575 5.28225 17.7008 5.17075 17.5111C5.05926 17.3213 5.00032 17.1053 5 16.8852V3.11487C5.00032 2.89478 5.05926 2.67875 5.17075 2.48899C5.28225 2.29923 5.44227 2.14259 5.63438 2.03518C5.82832 1.92608 6.04788 1.87073 6.27037 1.87485C6.49287 1.87897 6.71022 1.94241 6.9 2.05862L18.1562 8.94455C18.3379 9.0543 18.488 9.20918 18.5921 9.39413C18.6961 9.57908 18.7505 9.78781 18.75 10Z"
        fill="#828282"
      />
    </svg>
  )
}

const StyledPath = styled.path`
  fill: ${({ theme }) => theme.disabled};
`

export { PlayIco }