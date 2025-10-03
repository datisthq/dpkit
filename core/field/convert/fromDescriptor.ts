import type { Descriptor } from "../../general/index.ts"

export function convertFieldFromDescriptor(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)

  convertFormat(descriptor)
  convertMissingValues(descriptor)
  convertCategories(descriptor)
  convertCategoriesOrdered(descriptor)
  convertJsonschema(descriptor)

  return descriptor
}

function convertFormat(descriptor: Descriptor) {
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

function convertMissingValues(descriptor: Descriptor) {
  const missingValues = descriptor.missingValues
  if (!missingValues) {
    return
  }

  if (!Array.isArray(missingValues)) {
    descriptor.missingValues = undefined
    console.warn(`Ignoring v2.0 incompatible missingValues: ${missingValues}`)
  }
}

function convertCategories(descriptor: Descriptor) {
  const categories = descriptor.categories
  if (!categories) {
    return
  }

  if (categories && !Array.isArray(categories)) {
    descriptor.categories = undefined
    console.warn(`Ignoring v2.0 incompatible categories: ${categories}`)
  }
}

function convertCategoriesOrdered(descriptor: Descriptor) {
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

function convertJsonschema(descriptor: Descriptor) {
  const jsonschema = descriptor.jsonschema
  if (!jsonschema) {
    return
  }

  if (typeof jsonschema !== "object") {
    descriptor.jsonschema = undefined
    console.warn(`Ignoring v2.0 incompatible jsonschema: ${jsonschema}`)
  }
}
