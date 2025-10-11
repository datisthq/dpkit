import type { FileError, MetadataError, TableError } from "@dpkit/lib"
import { countBy } from "es-toolkit"
import type { Session } from "./session.ts"

export async function selectErrorResource(
  session: Session,
  errors: ((TableError | MetadataError | FileError) & { resource: string })[],
) {
  const groups = countBy(errors, error => error.resource)

  const name = await session.select({
    message: "Select error resource",
    skipable: true,
    options: [
      { label: `all (${errors.length})`, value: undefined },
      ...Object.entries(groups).map(([name, count]) => ({
        label: `${name} (${count})`,
        value: name,
      })),
    ],
  })

  return name
}

export async function selectErrorType(
  session: Session,
  errors: (TableError | MetadataError | FileError)[],
) {
  const groups = countBy(errors, error => error.type)

  if (Object.keys(groups).length <= 1) {
    return undefined
  }

  const type = await session.select({
    message: "Select error type",
    skipable: true,
    options: [
      { label: `all (${errors.length})`, value: undefined },
      ...Object.entries(groups).map(([type, count]) => ({
        label: `${type} (${count})`,
        value: type,
      })),
    ],
  })

  return type
}
