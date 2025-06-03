import type { Descriptor } from "../../general/index.js"

export function normalizeField(props: { descriptor: Descriptor }) {
  const field = globalThis.structuredClone(props.descriptor)

  normalizeFieldFormat({ field })
  normalizeFieldMissingValues({ field })
  normalizeFieldCategories({ field })
  normalizeFieldCategoriesOrdered({ field })
  normalizeFieldJsonschema({ field })

  return field
}

function normalizeFieldFormat(props: { field: Descriptor }) {
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

function normalizeFieldMissingValues(props: { field: Descriptor }) {
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

function normalizeFieldCategories(props: { field: Descriptor }) {
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

function normalizeFieldCategoriesOrdered(props: { field: Descriptor }) {
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

function normalizeFieldJsonschema(props: { field: Descriptor }) {
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
