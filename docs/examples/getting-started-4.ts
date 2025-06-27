import {
  loadPackageDescriptor,
  loadPackageFromZip,
  savePackageToZip,
} from "dpkit"
import { temporaryFileTask } from "tempy"

const sourcePackage = await loadPackageDescriptor(
  "https://raw.githubusercontent.com/roll/currency-codes/refs/heads/master/datapackage.json",
)

await temporaryFileTask(async archivePath => {
  await savePackageToZip(sourcePackage, { archivePath })
  const targetPackage = await loadPackageFromZip(archivePath)
  console.log(targetPackage)
})
