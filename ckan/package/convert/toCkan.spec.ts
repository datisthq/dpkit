import type { Package } from "@dpkit/core"
import { describe, expect, it } from "vitest"
import type { CkanPackage } from "../Package.ts"
import { convertPackageFromCkan } from "./fromCkan.ts"
import { convertPackageToCkan } from "./toCkan.ts"
import ckanPackageFixture from "../fixtures/ckan-package.json" with {
  type: "json",
}

describe("convertPackageToCkan", () => {
  it("converts a Frictionless Data Package to a CKAN package", () => {
    const dataPackage: Package = {
      name: "test-package",
      title: "Test Package",
      description: "This is a test package",
      version: "1.0.0",
      licenses: [
        {
          name: "cc-by",
          title: "Creative Commons Attribution",
          path: "http://www.opendefinition.org/licenses/cc-by",
        },
      ],
      contributors: [
        {
          title: "Test Author",
          email: "author@example.com",
          role: "author",
        },
        {
          title: "Test Maintainer",
          email: "maintainer@example.com",
          role: "maintainer",
        },
      ],
      keywords: ["test", "sample", "data"],
      created: "2023-01-01T00:00:00Z",
      resources: [
        {
          name: "test-resource",
          path: "https://example.com/data.csv",
          format: "csv",
          mediatype: "text/csv",
          description: "Test resource",
          bytes: 1024,
          hash: "md5:1234567890abcdef",
        },
      ],
    }

    const result = convertPackageToCkan(dataPackage)

    expect(result.name).toEqual(dataPackage.name)
    expect(result.title).toEqual(dataPackage.title)
    expect(result.notes).toEqual(dataPackage.description)
    expect(result.version).toEqual(dataPackage.version)

    if (
      dataPackage.licenses &&
      dataPackage.licenses.length > 0 &&
      dataPackage.licenses[0]
    ) {
      const license = dataPackage.licenses[0]
      if (license.name) expect(result.license_id).toEqual(license.name)
      if (license.title) expect(result.license_title).toEqual(license.title)
      if (license.path) expect(result.license_url).toEqual(license.path)
    }

    if (dataPackage.contributors && dataPackage.contributors.length >= 2) {
      const author = dataPackage.contributors.find(c => c.role === "author")
      const maintainer = dataPackage.contributors.find(
        c => c.role === "maintainer",
      )

      if (author) {
        expect(result.author).toEqual(author.title)
        expect(result.author_email).toEqual(author.email)
      }

      if (maintainer) {
        expect(result.maintainer).toEqual(maintainer.title)
        expect(result.maintainer_email).toEqual(maintainer.email)
      }
    }

    if (dataPackage.keywords && dataPackage.keywords.length > 0) {
      expect(result.tags).toHaveLength(dataPackage.keywords.length)
      dataPackage.keywords.forEach((keyword, index) => {
        const tag = result.tags?.[index]
        if (tag && keyword) {
          expect(tag.name).toEqual(keyword)
          expect(tag.display_name).toEqual(keyword)
        }
      })
    }

    expect(result.resources).toHaveLength(dataPackage.resources.length)

    expect(dataPackage.resources.length).toBeGreaterThan(0)
    expect(result.resources?.length).toBeGreaterThan(0)

    if (dataPackage.resources.length > 0 && result.resources.length > 0) {
      const firstResource = dataPackage.resources[0]
      const firstCkanResource = result.resources[0]

      expect(firstCkanResource).toBeDefined()
      expect(firstResource).toBeDefined()

      if (firstResource && firstCkanResource) {
        expect(firstCkanResource.description).toEqual(firstResource.description)
        expect(firstCkanResource.format).toEqual(
          firstResource.format?.toUpperCase(),
        )
        expect(firstCkanResource.mimetype).toEqual(firstResource.mediatype)
        expect(firstCkanResource.size).toEqual(firstResource.bytes)
        expect(firstCkanResource.hash).toEqual(firstResource.hash)
      }
    }
  })

  it("handles empty resources array", () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [],
    }

    const result = convertPackageToCkan(dataPackage)

    expect(result.resources).toEqual([])
  })

  it("handles undefined optional properties", () => {
    const dataPackage: Package = {
      resources: [],
    }

    const result = convertPackageToCkan(dataPackage)

    expect(result.name).toBeUndefined()
    expect(result.title).toBeUndefined()
    expect(result.notes).toBeUndefined()
    expect(result.version).toBeUndefined()
    expect(result.metadata_created).toBeUndefined()
    expect(result.license_id).toBeUndefined()
    expect(result.license_title).toBeUndefined()
    expect(result.license_url).toBeUndefined()
    expect(result.author).toBeUndefined()
    expect(result.author_email).toBeUndefined()
    expect(result.maintainer).toBeUndefined()
    expect(result.maintainer_email).toBeUndefined()
    expect(result.tags).toEqual([])
    expect(result.resources).toEqual([])
  })

  it("performs a round-trip conversion (CKAN → DP → CKAN)", () => {
    const originalCkanPackage = ckanPackageFixture as CkanPackage

    const dataPackage = convertPackageFromCkan(originalCkanPackage)

    const resultCkanPackage = convertPackageToCkan(dataPackage)

    expect(resultCkanPackage.name).toEqual(originalCkanPackage.name)
    expect(resultCkanPackage.title).toEqual(originalCkanPackage.title)
    expect(resultCkanPackage.notes).toEqual(originalCkanPackage.notes)
    expect(resultCkanPackage.version).toEqual(originalCkanPackage.version)

    expect(resultCkanPackage.license_id).toEqual(originalCkanPackage.license_id)
    expect(resultCkanPackage.license_title).toEqual(
      originalCkanPackage.license_title,
    )
    expect(resultCkanPackage.license_url).toEqual(
      originalCkanPackage.license_url,
    )

    expect(resultCkanPackage.author).toEqual(originalCkanPackage.author)
    expect(resultCkanPackage.author_email).toEqual(
      originalCkanPackage.author_email,
    )
    expect(resultCkanPackage.maintainer).toEqual(originalCkanPackage.maintainer)
    expect(resultCkanPackage.maintainer_email).toEqual(
      originalCkanPackage.maintainer_email,
    )

    expect(resultCkanPackage.resources.length).toBeGreaterThan(0)

    expect(resultCkanPackage.tags.length).toEqual(
      originalCkanPackage.tags.length,
    )
    originalCkanPackage.tags.forEach(originalTag => {
      const matchingTag = resultCkanPackage.tags.find(
        tag => tag.name === originalTag.name,
      )
      expect(matchingTag).toBeTruthy()
    })
  })
})
