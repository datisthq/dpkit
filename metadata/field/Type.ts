import type { Field } from "./Field.ts"

export type FieldType = Exclude<Field["type"], undefined>
