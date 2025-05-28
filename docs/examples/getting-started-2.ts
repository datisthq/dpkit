import { assertCamtrapPackage, loadPackage } from "dpkit"

const { datapackage } = await loadPackage({
  source:
    "https://raw.githubusercontent.com/tdwg/camtrap-dp/refs/tags/1.0.1/example/datapackage.json",
})

const camtrapPackage = await assertCamtrapPackage({ datapackage })

console.log(camtrapPackage.taxonomic)
console.log(camtrapPackage.project.title)
console.log(camtrapPackage.bibliographicCitation)
