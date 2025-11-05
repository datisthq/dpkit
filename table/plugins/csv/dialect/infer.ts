import { text } from "node:stream/consumers"
import type { Dialect, Resource } from "@dpkit/core"
import { loadFileStream } from "@dpkit/file"
import { default as CsvSnifferFactory } from "csv-sniffer"

const CSV_DELIMITERS = [",", ";", ":", "|", "\t", "^", "*", "&"]
const TSV_DELIMITERS = ["\t"]

export async function inferCsvDialect(
  resource: Partial<Resource>,
  options?: {
    sampleBytes?: number
  },
) {
  const { sampleBytes = 10_000 } = options ?? {}
  const isTabs = resource.format === "tsv"

  const dialect: Dialect = {}

  if (resource.path) {
    const stream = await loadFileStream(resource.path, {
      maxBytes: sampleBytes,
    })

    const sample = await text(stream)
    const result = sniffSample(sample, isTabs ? TSV_DELIMITERS : CSV_DELIMITERS)

    if (result?.delimiter) {
      dialect.delimiter = result.delimiter
    }

    if (result?.quoteChar) {
      dialect.quoteChar = result.quoteChar
    }

    //if (result.lineTerminator) {
    //  dialect.lineTerminator = result.lineTerminator
    //}

    // TODO: it gives false positives
    //if (!result.hasHeader) {
    //  dialect.header = false
    //}
  }

  return dialect
}

// Sniffer can fail for some reasons
function sniffSample(sample: string, delimiters: string[]) {
  try {
    const CsvSniffer = CsvSnifferFactory()
    const sniffer = new CsvSniffer(delimiters)
    const result = sniffer.sniff(sample)
    return result
  } catch {
    return undefined
  }
}
