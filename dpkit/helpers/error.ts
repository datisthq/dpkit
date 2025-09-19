import type { TableError } from "@dpkit/all"
import { countBy } from "../helpers/object.ts"
import type { Session } from "./session.ts"

export async function selectErrorType(session: Session, errors: TableError[]) {
  const groups = countBy(errors, error => error.type)

  const type = await session.select({
    message: "Select error type",
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
