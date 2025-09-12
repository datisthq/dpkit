import type { Descriptor } from "../general/index.ts"

export function normalizeField(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)

  normalizeFieldFormat(descriptor)
  normalizeFieldMissingValues(descriptor)
  normalizeFieldCategories(descriptor)
  normalizeFieldCategoriesOrdered(descriptor)
  normalizeFieldJsonschema(descriptor)

  return descriptor
}

function normalizeFieldFormat(descriptor: Descriptor) {
  const format = descriptor.format
  if (!format) {
    return
  }

  if (typeof format === "string") {
    if (format.startsWith("fmt:")) {
      descriptor.format = format.slice(4)
    }
  }
}

function normalizeFieldMissingValues(descriptor: Descriptor) {
  const missingValues = descriptor.missingValues
  if (!missingValues) {
    return
  }

  if (!Array.isArray(missingValues)) {
    descriptor.missingValues = undefined
    console.warn(`Ignoring v2.0 incompatible missingValues: ${missingValues}`)
  }
}

function normalizeFieldCategories(descriptor: Descriptor) {
  const categories = descriptor.categories
  if (!categories) {
    return
  }

  if (categories && !Array.isArray(categories)) {
    descriptor.categories = undefined
    console.warn(`Ignoring v2.0 incompatible categories: ${categories}`)
  }
}

function normalizeFieldCategoriesOrdered(descriptor: Descriptor) {
  const categoriesOrdered = descriptor.categoriesOrdered
  if (!categoriesOrdered) {
    return
  }

  if (typeof categoriesOrdered !== "boolean") {
    descriptor.categoriesOrdered = undefined
    console.warn(
      `Ignoring v2.0 incompatible categoriesOrdered: ${categoriesOrdered}`,
    )
  }
}

function normalizeFieldJsonschema(descriptor: Descriptor) {
  const jsonschema = descriptor.jsonschema
  if (!jsonschema) {
    return
  }

  if (typeof jsonschema !== "object") {
    descriptor.jsonschema = undefined
    console.warn(`Ignoring v2.0 incompatible jsonschema: ${jsonschema}`)
  }
}
