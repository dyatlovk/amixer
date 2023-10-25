export namespace MixerAudio {
  export function normalizeFromPanUi(val: number): PanType {
    return String(val / 100) as PanType
  }

  export function normalizeFromVolUi(val: number): VolumeType {
    return String(val / 100) as VolumeType
  }

  export function normalizeFromContext(val: PanType | VolumeType): number {
    return Number(val) * 100
  }
}
