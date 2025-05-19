import { readFile, writeFile } from "node:fs/promises"
import fs from "node:fs/promises"
import { join } from "node:path"

const registryDir = join(import.meta.dirname, "..", "registry")
const files = (await fs.readdir(registryDir)).filter(file =>
  file.endsWith(".json"),
)

console.log(`Found ${files.length} JSON files in registry directory`)

for (const file of files) {
  const filePath = join(registryDir, file)
  console.log(`Processing ${file}...`)

  const content = await readFile(filePath, "utf8")
  const profile = JSON.parse(content)

  let modified = false

  const pruneProperties = (obj: Record<string, unknown>): void => {
    if ("description" in obj) {
      if (!isObject(obj.description)) {
        obj.description = undefined
        modified = true
      }
    }

    if ("context" in obj) {
      if (!isObject(obj.context)) {
        obj.context = undefined
        modified = true
      }
    }

    if ("examples" in obj) {
      if (!isObject(obj.examples)) {
        obj.examples = undefined
        modified = true
      }
    }

    for (const key in obj) {
      if (isObject(obj[key])) {
        pruneProperties(obj[key] as Record<string, unknown>)
      } else if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          if (isObject(item)) {
            pruneProperties(item as Record<string, unknown>)
          }
        }
      }
    }
  }

  pruneProperties(profile)

  if (modified) {
    await writeFile(filePath, JSON.stringify(profile, null, 2), "utf8")
    console.log(
      `Updated ${file} - removed non-object descriptions and examples`,
    )
  } else {
    console.log(`No changes needed for ${file}`)
  }
}

console.log("Pruning completed successfully!")

function isObject(value: any) {
  return !!(value && typeof value === "object" && !Array.isArray(value))
}
