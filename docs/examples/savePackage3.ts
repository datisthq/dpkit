import { loadPackage, savePackageToZip } from "dpkit"

const datapackage = await loadPackage({
  path: "https://raw.githubusercontent.com/datasets/natural-gas/refs/heads/main/datapackage.json",
})

await savePackageToZip({
  datapackage,
  archivePath: ".user/gas.zip",
  withRemote: true,
})
