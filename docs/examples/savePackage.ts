import { loadPackage, savePackageToFolder } from "dpkit"

const datapack = await loadPackage({
  path: "https://raw.githubusercontent.com/datasets/natural-gas/refs/heads/main/datapackage.json",
})

await savePackageToFolder({ datapack, path: ".user/gas", withRemote: true })
