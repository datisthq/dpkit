import type { Descriptor } from "../../descriptor/index.js"

export function processDialectOnLoad(props: { descriptor: Descriptor }) {
  compatTable(props)
}

function compatTable(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const table = descriptor.table
  if (!table) {
    return
  }

  if (typeof table !== "string") {
    descriptor.table = undefined
    console.warn(`Ignoring v2.0 incompatible dialect table: ${table}`)
  }
}
