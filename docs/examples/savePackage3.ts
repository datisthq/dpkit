import { loadPackage, savePackageToZip } from "dpkit"

const datapack = await loadPackage({
  path: "https://raw.githubusercontent.com/datasets/natural-gas/refs/heads/main/datapackage.json",
})

await savePackageToZip({ datapack, path: ".user/gas.zip", withRemote: true })
