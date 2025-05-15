import { loadPackage, loadDialect } from "@dplib/meta"

const dialect = await loadDialect({
  path: "https://raw.githubusercontent.com/frictionlessdata/dplib-py/refs/heads/main/data/dialect.json",
})

console.log(dialect)
process.exit()

const dpackage = await loadPackage({
  path: "https://raw.githubusercontent.com/frictionlessdata/dplib-py/refs/heads/main/data/package-full.json",
})

console.log(dpackage)
