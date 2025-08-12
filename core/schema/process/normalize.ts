import invariant from "tiny-invariant"
import { normalizeField } from "../../field/index.ts"
import type { Descriptor } from "../../general/index.ts"

export function normalizeSchema(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)

  normalizeProfile(descriptor)
  normalizeFields(descriptor)
  normalizePrimaryKey(descriptor)
  normalizeForeignKeys(descriptor)
  normalizeUniqueKeys(descriptor)

  return descriptor
}

function normalizeProfile(descriptor: Descriptor) {
  descriptor.$schema = descriptor.$schema ?? descriptor.profile
}

function normalizeFields(descriptor: Descriptor) {
  const fields = descriptor.fields
  if (!fields) {
    return
  }

  invariant(
    Array.isArray(fields),
    "Fields being an array is guaranteed by the validation",
  )

  for (const field of fields) {
    normalizeField({ descriptor: field })
  }
}

function normalizePrimaryKey(descriptor: Descriptor) {
  const primaryKey = descriptor.primaryKey
  if (!primaryKey) {
    return
  }

  if (typeof primaryKey === "string") {
    descriptor.primaryKey = [primaryKey]
  }
}

function normalizeForeignKeys(descriptor: Descriptor) {
  const foreignKeys = descriptor.foreignKeys
  if (!foreignKeys) {
    return
  }

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

function normalizeUniqueKeys(descriptor: Descriptor) {
  const uniqueKeys = descriptor.uniqueKeys
  if (!uniqueKeys) {
    return
  }

  if (!Array.isArray(uniqueKeys)) {
    descriptor.uniqueKeys = undefined
    console.warn(`Ignoring v2.0 incompatible uniqueKeys: ${uniqueKeys}`)
    return
  }

  for (const uniqueKey of uniqueKeys) {
    if (!Array.isArray(uniqueKey)) {
      descriptor.uniqueKeys = undefined
      console.warn(`Ignoring v2.0 incompatible uniqueKey: ${uniqueKey}`)
      break
    }
  }
}
