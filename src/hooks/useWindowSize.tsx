import { useEffect, useState } from 'react'

export interface WindowSize {
  width: number
  height: number
}

const useWindowSize = (callback?: (size: WindowSize) => void): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      if (callback)
        callback({
          width: window.innerWidth,
          height: window.innerHeight,
        })
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export { useWindowSize }
