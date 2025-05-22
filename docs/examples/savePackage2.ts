import { loadPackage, savePackageToFolder } from "dpkit"

const datapackage = await loadPackage({
  path: "core/package/fixtures/package.json",
})

await savePackageToFolder({ datapackage, folderPath: ".user/test" })
