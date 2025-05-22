import { loadPackage, savePackageToFolder } from "dpkit"

const datapackage = await loadPackage({
  path: "https://raw.githubusercontent.com/datasets/natural-gas/refs/heads/main/datapackage.json",
})

await savePackageToFolder({
  datapackage,
  folderPath: ".user/gas",
  withRemote: true,
})
