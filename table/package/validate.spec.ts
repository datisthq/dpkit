import type { Package, Resource } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { Table } from "../table/Table.ts"
import { validatePackageForeignKeys } from "./validate.ts"

describe("validatePackageForeignKeys", () => {
  it("should validate package with valid foreign keys", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "users",
          type: "table" as const,
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

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          id: [1, 2, 3],
          name: ["Alice", "Bob", "Charlie"],
        })
        .lazy(),
      posts: pl
        .DataFrame({
          id: [1, 2, 3],
          user_id: [1, 2, 3],
          title: ["Post 1", "Post 2", "Post 3"],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          id: [1, 2],
          name: ["Alice", "Bob"],
        })
        .lazy(),
      posts: pl
        .DataFrame({
          id: [1, 2, 3],
          user_id: [1, 2, 999],
          title: ["Post 1", "Post 2", "Post 3"],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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

    const tables: Record<string, Table> = {
      categories: pl
        .DataFrame({
          id: [1, 2, 3],
          parent_id: [1, 1, 2],
          name: ["Root", "Child 1", "Child 2"],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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

    const tables: Record<string, Table> = {
      categories: pl
        .DataFrame({
          id: [1, 2, 3],
          parent_id: [1, 1, 999],
          name: ["Root", "Child 1", "Child 2"],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "posts",
          type: "table" as const,
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

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          id: [1],
        })
        .lazy(),
      posts: pl
        .DataFrame({
          id: [1, 2, 3, 4, 5],
          user_id: [999, 998, 997, 996, 995],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, {
      loadTable,
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
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "categories",
          type: "table" as const,
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "posts",
          type: "table" as const,
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

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          id: [1, 2],
        })
        .lazy(),
      categories: pl
        .DataFrame({
          id: [10, 20],
        })
        .lazy(),
      posts: pl
        .DataFrame({
          id: [1, 2],
          user_id: [1, 2],
          category_id: [10, 20],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "categories",
          type: "table" as const,
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
        {
          name: "posts",
          type: "table" as const,
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

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          id: [1],
        })
        .lazy(),
      categories: pl
        .DataFrame({
          id: [10],
        })
        .lazy(),
      posts: pl
        .DataFrame({
          id: [1, 2],
          user_id: [999, 1],
          category_id: [10, 888],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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
        },
        {
          name: "users",
          type: "table" as const,
          schema: {
            fields: [{ name: "id", type: "integer" as const }],
          },
        },
      ],
    }

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          id: [1],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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
          schema: {
            fields: [
              { name: "id", type: "integer" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
      ],
    }

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          id: [1, 2],
          name: ["Alice", "Bob"],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          first_name: ["Alice", "Bob"],
          last_name: ["Smith", "Jones"],
        })
        .lazy(),
      posts: pl
        .DataFrame({
          id: [1, 2],
          author_first: ["Alice", "Bob"],
          author_last: ["Smith", "Jones"],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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

    const tables: Record<string, Table> = {
      users: pl
        .DataFrame({
          first_name: ["Alice", "Bob"],
          last_name: ["Smith", "Jones"],
        })
        .lazy(),
      posts: pl
        .DataFrame({
          id: [1, 2],
          author_first: ["Alice", "Charlie"],
          author_last: ["Smith", "Brown"],
        })
        .lazy(),
    }

    const loadTable = async (resource: Resource): Promise<Table> => {
      return tables[resource.name]
    }

    const report = await validatePackageForeignKeys(dataPackage, { loadTable })

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
      },
    ])
  })
})
