declare interface MasterVol {
  value: VolumeType
  node: HTMLElement
}

declare interface EventMap {
  'track:loaded': CustomEvent
  'track:ready': CustomEvent
  'track:play': CustomEvent
  'track:stop': CustomEvent
  'track:pause': CustomEvent
  'track:end': CustomEvent
  'track:mute': CustomEvent
  'playlist:loaded': CustomEvent
  'knob:change': CustomEvent
  'master:vol': CustomEvent<MasterVol>
  'master:mute': CustomEvent
}
declare global {
  interface Document {
    addEventListener<K extends keyof EventMap>(
      type: K,
      listener: (this: Document, ev: EventMap[K]) => void
    ): void
    dispatchEvent<K extends keyof EventMap>(ev: EventMap[K]): void
  }
}
export {}
