import type { Descriptor } from "../../descriptor/index.js"

export function normalizeSchema(props: {
  descriptor: Descriptor
}) {
  normalizeFields(props)
  normalizePrimaryKey(props)
  normalizeForeignKeys(props)
  normalizeUniqueKeys(props)
}

function normalizeFields(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const fields = descriptor.fields
  if (!fields) {
    return
  }

  for (const field of fields) {
    normalizeFieldFormat({ field })
    normalizeFieldMissingValues({ field })
    normalizeFieldCategories({ field })
    normalizeFieldCategoriesOrdered({ field })
    normalizeFieldJsonschema({ field })
  }
}

function normalizeFieldFormat(props: { field: any }) {
  const { field } = props

  const format = field.format
  if (!format) {
    return
  }

  if (typeof format === "string") {
    if (format.startsWith("fmt:")) {
      field.format = format.slice(4)
    }
  }
}

function normalizeFieldMissingValues(props: { field: any }) {
  const { field } = props

  const missingValues = field.missingValues
  if (!missingValues) {
    return
  }

  if (!Array.isArray(missingValues)) {
    field.missingValues = undefined
    console.warn(`Ignoring v2.0 incompatible missingValues: ${missingValues}`)
  }
}

function normalizeFieldCategories(props: { field: any }) {
  const { field } = props

  const categories = field.categories
  if (!categories) {
    return
  }

  if (categories && !Array.isArray(categories)) {
    field.categories = undefined
    console.warn(`Ignoring v2.0 incompatible categories: ${categories}`)
  }
}

function normalizeFieldCategoriesOrdered(props: { field: any }) {
  const { field } = props

  const categoriesOrdered = field.categoriesOrdered
  if (!categoriesOrdered) {
    return
  }

  if (typeof categoriesOrdered !== "boolean") {
    field.categoriesOrdered = undefined
    console.warn(
      `Ignoring v2.0 incompatible categoriesOrdered: ${categoriesOrdered}`,
    )
  }
}

function normalizeFieldJsonschema(props: { field: any }) {
  const { field } = props

  const jsonschema = field.jsonschema
  if (!jsonschema) {
    return
  }

  if (typeof jsonschema !== "object") {
    field.jsonschema = undefined
    console.warn(`Ignoring v2.0 incompatible jsonschema: ${jsonschema}`)
  }
}

function normalizePrimaryKey(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const primaryKey = descriptor.primaryKey
  if (!primaryKey) {
    return
  }

  if (typeof primaryKey === "string") {
    descriptor.primaryKey = [primaryKey]
  }
}

function normalizeForeignKeys(props: { descriptor: Descriptor }) {
  const { descriptor } = props

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

function normalizeUniqueKeys(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const uniqueKeys = descriptor.uniqueKeys
  if (!uniqueKeys) {
    return
  }

  if (!Array.isArray(uniqueKeys)) {
    descriptor.uniqueKeys = undefined
    console.warn(`Ignoring v2.0 incompatible uniqueKeys: ${uniqueKeys}`)
  }

  for (const uniqueKey of uniqueKeys) {
    if (!Array.isArray(uniqueKey)) {
      descriptor.uniqueKeys = undefined
      console.warn(`Ignoring v2.0 incompatible uniqueKey: ${uniqueKey}`)
      break
    }
  }
}
