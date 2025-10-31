export type Metadata = {
  /**
   * Custom properties
   */
  [key in `${string}:${string}`]?: any
}
