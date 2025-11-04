import type { BaseDocument } from "./Base.ts"

export interface JsonDocument extends BaseDocument {
  type: "json"
  data: Record<string, any>
}
