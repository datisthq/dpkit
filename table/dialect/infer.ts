import type { DialectOptions } from "./Options.ts"

// TODO: Have some shared inferDialect* function?

export interface InferDialectOptions extends DialectOptions {
  sampleBytes?: number
}
