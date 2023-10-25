import { useState } from 'react'

function useUpdater() {
  let [value, setState] = useState(true)
  return () => setState(!value)
}

export default useUpdater
