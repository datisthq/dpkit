import type { Descriptor } from "../../descriptor/index.js"

export function processSchemaOnLoad(props: {
  descriptor: Descriptor
}) {
  compatFields(props)
  compatPrimaryKey(props)
  compatForeignKeys(props)
  compatUniqueKeys(props)
}

function compatFields(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const fields = descriptor.fields
  if (!fields) {
    return
  }

  for (const field of fields) {
    compatFieldFormat({ field })
    compatFieldMissingValues({ field })
    compatFieldCategories({ field })
    compatFieldCategoriesOrdered({ field })
    compatFieldJsonschema({ field })
  }
}

function compatFieldFormat(props: { field: any }) {
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

function compatFieldMissingValues(props: { field: any }) {
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

function compatFieldCategories(props: { field: any }) {
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

function compatFieldCategoriesOrdered(props: { field: any }) {
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

function compatFieldJsonschema(props: { field: any }) {
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

function compatPrimaryKey(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const primaryKey = descriptor.primaryKey
  if (!primaryKey) {
    return
  }

  if (typeof primaryKey === "string") {
    descriptor.primaryKey = [primaryKey]
  }
}

function compatForeignKeys(props: { descriptor: Descriptor }) {
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

function compatUniqueKeys(props: { descriptor: Descriptor }) {
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
