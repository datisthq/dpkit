import type { Field } from "@dpkit/core"
import type { TableError } from "../error/index.js"

export async function validateColumn(props: {
  field: Field
}) {
  console.log(props)
  const errors: TableError[] = []

  return errors
}
