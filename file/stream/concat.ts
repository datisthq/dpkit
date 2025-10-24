import type { Readable } from "node:stream"
import { default as Multistream } from "multistream"

export function concatFileStreams(streams: Readable[]) {
  return new Multistream(streams)
}
