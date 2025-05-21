import { loadPackageFromZip } from "dpkit"

const { datapack } = await loadPackageFromZip({
  path: ".user/gas.zip",
})

console.log(datapack)
