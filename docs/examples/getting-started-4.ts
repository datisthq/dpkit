import {
  getTempFilePath,
  loadPackageDescriptor,
  loadPackageFromZip,
  savePackageToZip,
} from "dpkit"

const archivePath = getTempFilePath()
const sourcePackage = await loadPackageDescriptor(
  "https://raw.githubusercontent.com/roll/currency-codes/refs/heads/master/datapackage.json",
)

await savePackageToZip(sourcePackage, { archivePath })
const targetPackage = await loadPackageFromZip(archivePath)
console.log(targetPackage)
