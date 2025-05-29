import {
  loadPackageDescriptor,
  loadPackageFromZip,
  savePackageToZip,
} from "dpkit"
import { temporaryFileTask } from "tempy"

const sourcePackage = await loadPackageDescriptor({
  path: "https://raw.githubusercontent.com/roll/currency-codes/refs/heads/master/datapackage.json",
})

await temporaryFileTask(
  async archivePath => {
    await savePackageToZip({ datapackage: sourcePackage, archivePath })
    const { datapackage: targetPackage, cleanup } = await loadPackageFromZip({
      archivePath,
    })
    console.log(targetPackage)
    await cleanup()
  },
  { extension: "zip" },
)
