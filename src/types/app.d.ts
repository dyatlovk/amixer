type pl = import('App/domain/mixer/playlist').Playlist
type strFloatRange = import('@tjmora/ts-range-types').StringFloatRange<0, 1, 2>
type strFloatRangePan = import('@tjmora/ts-range-types').StringFloatRange<
  [1],
  1,
  2
>
type knobVolRange = import('@tjmora/ts-range-types').IntRange<0, 100>
type knobPanRange = import('@tjmora/ts-range-types').IntRange<[100], 100>

declare interface AppState {
  playlist: pl
}

declare type VolumeType = strFloatRange
declare type PanType = strFloatRangePan
declare type KnobVolRangeType = knobVolRange
declare type KnobPanRangeType = knobPanRange

declare interface MasterVol {
  value: VolumeType
  node: HTMLElement
}

declare interface TrackPlay {
  id: string
  unpause: boolean
}
