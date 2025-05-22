import { loadPackageFromZip } from "dpkit"

const { datapackage } = await loadPackageFromZip({
  archivePath: ".user/gas.zip",
})

console.log(datapackage)
