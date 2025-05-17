import type { Descriptor } from "../../descriptor/index.js"

type ProcessProps = {
  descriptor: Descriptor
}

export function processSchemaOnLoad(props: ProcessProps) {
  makeCompatible(props)
}

function makeCompatible(props: ProcessProps) {
  const { descriptor } = props

  const primaryKey = descriptor.primaryKey
  if (typeof primaryKey === "string") {
    descriptor.primaryKey = [primaryKey]
  }

  const fields = descriptor.fields
  if (Array.isArray(fields)) {
    for (const field of fields) {
      const format = field.format
      if (typeof format === "string") {
        if (format.startsWith("fmt:")) {
          field.format = format.slice(4)
        }
      }
    }
  }

  const foreignKeys = descriptor.foreignKeys
  if (Array.isArray(foreignKeys)) {
    for (const foreignKey of foreignKeys) {
      const fields = foreignKey.fields
      if (typeof fields === "string") {
        foreignKey.fields = [fields]
      }

      const referenceFields = foreignKey.reference?.fields
      if (typeof referenceFields === "string") {
        foreignKey.reference.fields = [referenceFields]
      }
    }
  }
}
