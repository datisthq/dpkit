import { describe, expect, it, vi } from "vitest"
import { saveResourceFiles } from "./save.js"

describe("saveResourceFiles", () => {
  it.each([
    {
      description: "local path",
      resource: { path: "data/table.csv" },
      basepath: "data",
      descriptor: { path: "table.csv" },
    },
    {
      description: "local path and remote path",
      resource: {
        path: "data/table.csv",
        schema: "https://example.com/schema.json",
      },
      basepath: "data",
      descriptor: {
        path: "table.csv",
        schema: "https://example.com/schema.json",
      },
    },
    {
      description: "local path and remote path withRemote",
      resource: {
        type: "table",
        path: "data/table.csv",
        schema: "https://example.com/schema.json",
      },
      basepath: "data",
      withRemote: true,
      descriptor: {
        type: "table",
        path: "table.csv",
        schema: "schema.json",
      },
    },
    {
      description: "local paths in different folders",
      resource: {
        type: "table",
        path: "data/folder1/table.csv",
        schema: "data/folder2/schema.json",
      },
      basepath: "data",
      descriptor: {
        type: "table",
        path: "folder1/table.csv",
        schema: "folder2/schema.json",
      },
    },
    {
      description: "local paths in different folders withoutFolders",
      resource: {
        type: "table",
        path: "data/folder1/table.csv",
        schema: "data/folder2/schema.json",
      },
      basepath: "data",
      withoutFolders: true,
      descriptor: {
        type: "table",
        path: "folder1-table.csv",
        schema: "folder2-schema.json",
      },
    },
  ])(
    "$description",
    async ({ resource, basepath, withRemote, withoutFolders, descriptor }) => {
      expect(
        await saveResourceFiles({
          // @ts-ignore
          resource,
          basepath,
          withRemote,
          withoutFolders,
          saveFile: vi.fn(),
        }),
      ).toEqual(descriptor)
    },
  )
})
