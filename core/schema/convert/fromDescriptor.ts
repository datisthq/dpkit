import invariant from "tiny-invariant"
import { convertFieldFromDescriptor } from "../../field/index.ts"
import type { Descriptor } from "../../general/index.ts"

export function convertSchemaFromDescriptor(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)

  convertProfile(descriptor)
  convertFields(descriptor)
  convertPrimaryKey(descriptor)
  convertForeignKeys(descriptor)
  convertUniqueKeys(descriptor)

  return descriptor
}

function convertProfile(descriptor: Descriptor) {
  descriptor.$schema = descriptor.$schema ?? descriptor.profile
}

function convertFields(descriptor: Descriptor) {
  const fields = descriptor.fields
  if (!fields) {
    return
  }

  invariant(
    Array.isArray(fields),
    "Fields being an array is guaranteed by the validation",
  )

  for (const field of fields) {
    convertFieldFromDescriptor(field)
  }
}

function convertPrimaryKey(descriptor: Descriptor) {
  const primaryKey = descriptor.primaryKey
  if (!primaryKey) {
    return
  }

  if (typeof primaryKey === "string") {
    descriptor.primaryKey = [primaryKey]
  }
}

function convertForeignKeys(descriptor: Descriptor) {
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

function convertUniqueKeys(descriptor: Descriptor) {
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
