export function durationFormatter(duration: number): string {
  if (duration === 0) {
    return '--:--'
  }

  const h = Math.floor(duration / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((duration % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(duration % 60)
      .toString()
      .padStart(2, '0')

  return m + ':' + s
}
