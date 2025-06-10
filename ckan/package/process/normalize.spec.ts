import { describe, expect, it } from "vitest"
import type { CkanPackage } from "../Package.js"
import ckanPackageFixture from "../fixtures/ckan-package.json" with {
  type: "json",
}
import { normalizeCkanPackage } from "./normalize.js"

describe("normalizeCkanPackage", () => {
  it("normalizes a CKAN package to a Frictionless Data Package", () => {
    // Arrange
    const ckanPackage = ckanPackageFixture as CkanPackage

    // Act
    const result = normalizeCkanPackage(ckanPackage)

    // Assert
    // Basic metadata
    expect(result.name).toEqual(ckanPackage.name)
    expect(result.title).toEqual(ckanPackage.title)
    expect(result.description).toEqual(ckanPackage.notes)
    expect(result.version).toEqual(ckanPackage.version)
    expect(result.created).toEqual(ckanPackage.metadata_created)

    // License
    expect(result.licenses).toHaveLength(1)
    if (result.licenses && result.licenses.length > 0 && result.licenses[0]) {
      const license = result.licenses[0]
      if (ckanPackage.license_id)
        expect(license.name).toEqual(ckanPackage.license_id)
      if (ckanPackage.license_title)
        expect(license.title).toEqual(ckanPackage.license_title)
      if (ckanPackage.license_url)
        expect(license.path).toEqual(ckanPackage.license_url)
    }

    // Contributors
    expect(result.contributors).toHaveLength(2)
    // Author
    if (result.contributors) {
      const author = result.contributors.find(c => c.role === "author")
      expect(author).toBeTruthy()
      if (author) {
        expect(author.title).toEqual(ckanPackage.author)
        expect(author.email).toEqual(ckanPackage.author_email)
      }

      // Maintainer
      const maintainer = result.contributors.find(c => c.role === "maintainer")
      expect(maintainer).toBeTruthy()
      if (maintainer) {
        expect(maintainer.title).toEqual(ckanPackage.maintainer)
        expect(maintainer.email).toEqual(ckanPackage.maintainer_email)
      }
    }

    // Keywords
    expect(result.keywords).toHaveLength(ckanPackage.tags.length)
    expect(result.keywords).toEqual(ckanPackage.tags.map(tag => tag.name))

    // Resources
    expect(result.resources).toHaveLength(ckanPackage.resources.length)

    // Verify first resource
    const firstCkanResource = ckanPackage.resources[0]
    const firstResource = result.resources[0]

    // Ensure resources exist before testing them
    expect(firstCkanResource).toBeDefined()
    expect(firstResource).toBeDefined()

    if (firstResource && firstCkanResource) {
      expect(firstResource.path).toEqual(firstCkanResource.url)
      // Name is slugified
      expect(firstResource.name).toMatch(/^sample[-_]linked[-_]csv$/)
      expect(firstResource.description).toEqual(firstCkanResource.description)
      expect(firstResource.format).toEqual(
        firstCkanResource.format?.toLowerCase(),
      )
      expect(firstResource.mediatype).toEqual(firstCkanResource.mimetype)
    }
  })

  it("handles empty resources array", () => {
    // Arrange
    const ckanPackage: CkanPackage = {
      ...(ckanPackageFixture as CkanPackage),
      resources: [],
    }

    // Act
    const result = normalizeCkanPackage(ckanPackage)

    // Assert
    expect(result.resources).toEqual([])
  })

  it("handles undefined optional properties", () => {
    // Arrange
    const ckanPackage: Partial<CkanPackage> = {
      resources: [],
      tags: [],
      // Only required properties
    }

    // Act
    // @ts-ignore
    const result = normalizeCkanPackage(ckanPackage)

    // Assert
    expect(result.name).toBeUndefined()
    expect(result.title).toBeUndefined()
    expect(result.description).toBeUndefined()
    expect(result.version).toBeUndefined()
    expect(result.created).toBeUndefined()
    expect(result.licenses).toBeUndefined()
    expect(result.contributors).toBeUndefined()
    expect(result.keywords).toBeUndefined()
    expect(result.resources).toEqual([])
  })
})
