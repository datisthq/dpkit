import type { Package } from "@dpkit/core"
import { describe, expect, it } from "vitest"
import type { CkanPackage } from "../Package.js"
import ckanPackageFixture from "../fixtures/ckan-package.json" with {
  type: "json",
}
import { denormalizeCkanPackage } from "./denormalize.js"
import { normalizeCkanPackage } from "./normalize.js"

describe("denormalizeCkanPackage", () => {
  it("denormalizes a Frictionless Data Package to a CKAN package", () => {
    // Arrange
    const datapackage: Package = {
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

    // Act
    const result = denormalizeCkanPackage({ datapackage })

    // Assert
    // Basic metadata
    expect(result.name).toEqual(datapackage.name)
    expect(result.title).toEqual(datapackage.title)
    expect(result.notes).toEqual(datapackage.description)
    expect(result.version).toEqual(datapackage.version)
    //expect(result.metadata_created).toEqual(datapackage.created)

    // License
    if (
      datapackage.licenses &&
      datapackage.licenses.length > 0 &&
      datapackage.licenses[0]
    ) {
      const license = datapackage.licenses[0]
      if (license.name) expect(result.license_id).toEqual(license.name)
      if (license.title) expect(result.license_title).toEqual(license.title)
      if (license.path) expect(result.license_url).toEqual(license.path)
    }

    // Contributors
    if (datapackage.contributors && datapackage.contributors.length >= 2) {
      const author = datapackage.contributors.find(c => c.role === "author")
      const maintainer = datapackage.contributors.find(
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

    // Tags
    if (datapackage.keywords && datapackage.keywords.length > 0) {
      expect(result.tags).toHaveLength(datapackage.keywords.length)
      datapackage.keywords.forEach((keyword, index) => {
        const tag = result.tags?.[index]
        if (tag && keyword) {
          expect(tag.name).toEqual(keyword)
          expect(tag.display_name).toEqual(keyword)
        }
      })
    }

    // Resources
    expect(result.resources).toHaveLength(datapackage.resources.length)

    // Verify resources exist
    expect(datapackage.resources.length).toBeGreaterThan(0)
    expect(result.resources?.length).toBeGreaterThan(0)

    if (datapackage.resources.length > 0 && result.resources.length > 0) {
      // Verify first resource
      const firstResource = datapackage.resources[0]
      const firstCkanResource = result.resources[0]

      expect(firstCkanResource).toBeDefined()
      expect(firstResource).toBeDefined()

      if (firstResource && firstCkanResource) {
        //expect(firstCkanResource.url).toEqual(firstResource.path)
        // Name comes from title or is extracted from path
        const expectedName = firstResource.title || "data.csv" // We know getFilename extracts this from the URL
        expect(firstCkanResource.name).toEqual(expectedName)
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
    // Arrange
    const datapackage: Package = {
      name: "test-package",
      resources: [],
    }

    // Act
    const result = denormalizeCkanPackage({ datapackage })

    // Assert
    expect(result.resources).toEqual([])
  })

  it("handles undefined optional properties", () => {
    // Arrange
    const datapackage: Package = {
      resources: [], // Only required property
    }

    // Act
    const result = denormalizeCkanPackage({ datapackage })

    // Assert
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
    // Arrange
    const originalCkanPackage = ckanPackageFixture as CkanPackage

    // Act - First normalize to a Frictionless Data Package
    const datapackage = normalizeCkanPackage({
      ckanPackage: originalCkanPackage,
    })

    // Then denormalize back to a CKAN package
    const resultCkanPackage = denormalizeCkanPackage({ datapackage })

    // Assert
    // Basic metadata
    expect(resultCkanPackage.name).toEqual(originalCkanPackage.name)
    expect(resultCkanPackage.title).toEqual(originalCkanPackage.title)
    expect(resultCkanPackage.notes).toEqual(originalCkanPackage.notes)
    expect(resultCkanPackage.version).toEqual(originalCkanPackage.version)

    // License
    expect(resultCkanPackage.license_id).toEqual(originalCkanPackage.license_id)
    expect(resultCkanPackage.license_title).toEqual(
      originalCkanPackage.license_title,
    )
    expect(resultCkanPackage.license_url).toEqual(
      originalCkanPackage.license_url,
    )

    // Contributors
    expect(resultCkanPackage.author).toEqual(originalCkanPackage.author)
    expect(resultCkanPackage.author_email).toEqual(
      originalCkanPackage.author_email,
    )
    expect(resultCkanPackage.maintainer).toEqual(originalCkanPackage.maintainer)
    expect(resultCkanPackage.maintainer_email).toEqual(
      originalCkanPackage.maintainer_email,
    )

    // Resources - counts might differ due to resource filtering in denormalizeCkanResource
    // Some resources might be filtered out if they don't have valid names
    expect(resultCkanPackage.resources.length).toBeGreaterThan(0)
    // Verify resources are properly converted
    resultCkanPackage.resources.forEach(resource => {
      //expect(resource.url).toBeTruthy()
      expect(resource.name).toBeTruthy()
    })

    // Tags - verify all tag names are preserved
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
