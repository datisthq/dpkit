import { loadDialect, loadPackage } from "dpkit"

const BASE_URL =
  "https://raw.githubusercontent.com/frictionlessdata/dplib-py/refs/heads/main/data"

const dialect = await loadDialect({ path: `${BASE_URL}/dialect.json` })
console.log(dialect)

const dpackage = await loadPackage({ path: "examples/metadata/dpackage.json" })
console.log(dpackage)
