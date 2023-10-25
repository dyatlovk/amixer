interface CustomEventMap {
  'track:loaded': CustomEvent
  'track:ready': CustomEvent
  'track:play': CustomEvent
  'track:stop': CustomEvent
  'track:pause': CustomEvent
  'track:end': CustomEvent
  'track:mute': CustomEvent
  'playlist:loaded': CustomEvent
  'knob:change': CustomEvent
}
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void
  }
}
export {} //keep that for TS compiler.
