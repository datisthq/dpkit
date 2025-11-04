import type { Package } from "@dpkit/core"
import { describe, expect, it } from "vitest"
import { validatePackageIntegrity } from "./integrity.ts"

describe("validatePackageIntegrity", () => {
  it("should validate package with valid foreign keys", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
          data: [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
            { id: 3, name: "Charlie" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
        {
          name: "posts",
          type: "table" as const,
          data: [
            { id: 1, user_id: 1, title: "Post 1" },
            { id: 2, user_id: 2, title: "Post 2" },
            { id: 3, user_id: 3, title: "Post 3" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "user_id", type: "integer" as const },
              { name: "title", type: "string" as const },
            ],
            foreignKeys: [
              {
                fields: ["user_id"],
                reference: {
                  resource: "users",
                  fields: ["id"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should detect foreign key violations", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
          data: [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
        {
          name: "posts",
          type: "table" as const,
          data: [
            { id: 1, user_id: 1, title: "Post 1" },
            { id: 2, user_id: 2, title: "Post 2" },
            { id: 3, user_id: 999, title: "Post 3" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "user_id", type: "integer" as const },
              { name: "title", type: "string" as const },
            ],
            foreignKeys: [
              {
                fields: ["user_id"],
                reference: {
                  resource: "users",
                  fields: ["id"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        type: "foreignKey",
        foreignKey: {
          fields: ["user_id"],
          reference: {
            resource: "users",
            fields: ["id"],
          },
        },
        cells: ["999"],
        resource: "posts",
      },
    ])
  })

  it("should handle self-referencing foreign keys", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "categories",
          type: "table" as const,
          data: [
            { id: 1, parent_id: 1, name: "Root" },
            { id: 2, parent_id: 1, name: "Child 1" },
            { id: 3, parent_id: 2, name: "Child 2" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "parent_id", type: "integer" as const },
              { name: "name", type: "string" as const },
            ],
            foreignKeys: [
              {
                fields: ["parent_id"],
                reference: {
                  fields: ["id"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should detect violations in self-referencing foreign keys", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "categories",
          type: "table" as const,
          data: [
            { id: 1, parent_id: 1, name: "Root" },
            { id: 2, parent_id: 1, name: "Child 1" },
            { id: 3, parent_id: 999, name: "Child 2" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "parent_id", type: "integer" as const },
              { name: "name", type: "string" as const },
            ],
            foreignKeys: [
              {
                fields: ["parent_id"],
                reference: {
                  fields: ["id"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        type: "foreignKey",
        foreignKey: {
          fields: ["parent_id"],
          reference: {
            fields: ["id"],
          },
        },
        cells: ["999"],
        resource: "categories",
      },
    ])
  })

  it("should respect maxErrors limit", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
          data: [{ id: 1 }],
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "posts",
          type: "table" as const,
          data: [
            { id: 1, user_id: 999 },
            { id: 2, user_id: 998 },
            { id: 3, user_id: 997 },
            { id: 4, user_id: 996 },
            { id: 5, user_id: 995 },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "user_id", type: "integer" as const },
            ],
            foreignKeys: [
              {
                fields: ["user_id"],
                reference: {
                  resource: "users",
                  fields: ["id"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage, {
      maxErrors: 3,
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        type: "foreignKey",
        foreignKey: {
          fields: ["user_id"],
          reference: {
            resource: "users",
            fields: ["id"],
          },
        },
        cells: ["999"],
        resource: "posts",
      },
      {
        type: "foreignKey",
        foreignKey: {
          fields: ["user_id"],
          reference: {
            resource: "users",
            fields: ["id"],
          },
        },
        cells: ["998"],
        resource: "posts",
      },
      {
        type: "foreignKey",
        foreignKey: {
          fields: ["user_id"],
          reference: {
            resource: "users",
            fields: ["id"],
          },
        },
        cells: ["997"],
        resource: "posts",
      },
    ])
  })

  it("should handle multiple foreign keys in a resource", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
          data: [{ id: 1 }, { id: 2 }],
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "categories",
          type: "table" as const,
          data: [{ id: 10 }, { id: 20 }],
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "posts",
          type: "table" as const,
          data: [
            { id: 1, user_id: 1, category_id: 10 },
            { id: 2, user_id: 2, category_id: 20 },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "user_id", type: "integer" as const },
              { name: "category_id", type: "integer" as const },
            ],
            foreignKeys: [
              {
                fields: ["user_id"],
                reference: {
                  resource: "users",
                  fields: ["id"],
                },
              },
              {
                fields: ["category_id"],
                reference: {
                  resource: "categories",
                  fields: ["id"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should detect violations in multiple foreign keys", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
          data: [{ id: 1 }],
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "categories",
          type: "table" as const,
          data: [{ id: 10 }],
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "posts",
          type: "table" as const,
          data: [
            { id: 1, user_id: 999, category_id: 10 },
            { id: 2, user_id: 1, category_id: 888 },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "user_id", type: "integer" as const },
              { name: "category_id", type: "integer" as const },
            ],
            foreignKeys: [
              {
                fields: ["user_id"],
                reference: {
                  resource: "users",
                  fields: ["id"],
                },
              },
              {
                fields: ["category_id"],
                reference: {
                  resource: "categories",
                  fields: ["id"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        type: "foreignKey",
        foreignKey: {
          fields: ["user_id"],
          reference: {
            resource: "users",
            fields: ["id"],
          },
        },
        cells: ["999"],
        resource: "posts",
      },
      {
        type: "foreignKey",
        foreignKey: {
          fields: ["category_id"],
          reference: {
            resource: "categories",
            fields: ["id"],
          },
        },
        cells: ["888"],
        resource: "posts",
      },
    ])
  })

  it("should skip resources without schema", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "no-schema",
          type: "table" as const,
          data: [{ value: 1 }],
        },
        {
          name: "users",
          type: "table" as const,
          data: [{ id: 1 }],
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should skip resources without foreign keys", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
          data: [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should handle composite foreign keys", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
          data: [
            { first_name: "Alice", last_name: "Smith" },
            { first_name: "Bob", last_name: "Jones" },
          ],
          schema: {
            fields: [
              { name: "first_name", type: "string" as const },
              { name: "last_name", type: "string" as const },
            ],
          },
        },
        {
          name: "posts",
          type: "table" as const,
          data: [
            { id: 1, author_first: "Alice", author_last: "Smith" },
            { id: 2, author_first: "Bob", author_last: "Jones" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "author_first", type: "string" as const },
              { name: "author_last", type: "string" as const },
            ],
            foreignKeys: [
              {
                fields: ["author_first", "author_last"],
                reference: {
                  resource: "users",
                  fields: ["first_name", "last_name"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should detect violations in composite foreign keys", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
          data: [
            { first_name: "Alice", last_name: "Smith" },
            { first_name: "Bob", last_name: "Jones" },
          ],
          schema: {
            fields: [
              { name: "first_name", type: "string" as const },
              { name: "last_name", type: "string" as const },
            ],
          },
        },
        {
          name: "posts",
          type: "table" as const,
          data: [
            { id: 1, author_first: "Alice", author_last: "Smith" },
            { id: 2, author_first: "Charlie", author_last: "Brown" },
          ],
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "author_first", type: "string" as const },
              { name: "author_last", type: "string" as const },
            ],
            foreignKeys: [
              {
                fields: ["author_first", "author_last"],
                reference: {
                  resource: "users",
                  fields: ["first_name", "last_name"],
                },
              },
            ],
          },
        },
      ],
    }

    const report = await validatePackageIntegrity(dataPackage)

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        type: "foreignKey",
        foreignKey: {
          fields: ["author_first", "author_last"],
          reference: {
            resource: "users",
            fields: ["first_name", "last_name"],
          },
        },
        cells: ["Charlie", "Brown"],
        resource: "posts",
      },
    ])
  })
})
