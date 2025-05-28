import { loadPackage, type CamtrapPackage } from "dpkit"

const { datapackage } = await loadPackage<CamtrapPackage>({
  source: "https://zenodo.org/records/10053903",
})

console.log(datapackage)
