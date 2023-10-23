interface SvgKnobOptions {
  label?: boolean
  rotation?: boolean
  default_value?: number
  initial_value?: number
  value_min?: number
  value_max?: number
  value_resolution?: number
  center_zero?: boolean
  center_value?: number | null
  center_gap?: number
  zero_at?: number
  angle_min?: number
  angle_max?: number
  bg_radius?: number
  bg_border_width?: number
  track_bg_radius?: number
  track_bg_width?: number
  track_radius?: number
  track_width?: number
  cursor_radius?: number
  cursor_length?: number
  cursor_width?: number
  palette?: Theme
  bg?: boolean
  track_bg?: boolean
  track?: boolean
  cursor?: boolean
  linecap?: string
  value_text?: boolean
  value_position?: number
  font_family?: string
  font_size?: number
  display_raw?: boolean
  format_raw?: Function
  format?: Function
  font_weight?: string
  markers?: number
  markers_radius?: number
  markers_length?: number
  markers_width?: number
  class_bg?: string
  class_track_bg?: string
  class_track?: string
  class_value?: string
  class_cursor?: string
  class_markers?: string
  snap_to_steps?: boolean
  mouse_wheel_acceleration?: number
  onchange?: Function
}

type Theme = 'dark' | 'light'

interface SvgKnobResult {
  value: any
  config: any
}

declare function SvgKnob(
  elem: HTMLDivElement | null,
  conf: SvgKnobOptions
): SvgKnobResult

export = SvgKnob
