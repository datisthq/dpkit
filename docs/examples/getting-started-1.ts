import { loadPackage } from "dpkit"

const dataPackage = await loadPackage("https://zenodo.org/records/10053903")

console.log(dataPackage)
