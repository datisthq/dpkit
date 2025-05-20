import { loadPackage, savePackageToFolder } from "dpkit"

const datapack = await loadPackage({
  path: "core/package/fixtures/package.json",
})

await savePackageToFolder({ datapack, folder: ".user/test" })
