import { useEffect, useState } from 'react'

export enum Themes {
  Dark = 'dark',
  Light = 'light',
}

const useThemeDetector = (): Themes => {
  const [theme, setTheme] = useState<Themes>(Themes.Dark)
  useEffect(() => {
    const callback = (e: any) => {
      const newColorScheme = e.matches ? Themes.Dark : Themes.Light
      setTheme(newColorScheme)
    }
    const match = window.matchMedia('(prefers-color-scheme: dark)')
    match.addEventListener('change', callback)
    callback(match)

    return () => match.removeEventListener('change', callback)
  }, [])

  return theme
}

export default useThemeDetector
