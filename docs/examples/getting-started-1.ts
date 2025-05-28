import { loadPackage } from "dpkit"

const { datapackage } = await loadPackage({
  source: "https://zenodo.org/records/10053903",
})

console.log(datapackage)
