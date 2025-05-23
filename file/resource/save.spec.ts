import { describe, expect, it } from "vitest"
import { saveResourceFiles } from "./save.js"

describe("saveResourceFiles", () => {
  it.each([
    {
      description: "local path",
      basepath: "data",
      resource: { path: "data/table.csv" },
      descriptor: { path: "table.csv" },
    },
    {
      description: "local paths",
      basepath: "data",
      resource: { path: ["data/table1.csv", "data/table2.csv"] },
      descriptor: { path: ["table1.csv", "table2.csv"] },
    },
    {
      description: "local path and remote path",
      basepath: "data",
      resource: {
        path: "data/table.csv",
        schema: "https://example.com/schema.json",
      },
      descriptor: {
        path: "table.csv",
        schema: "https://example.com/schema.json",
      },
    },
    {
      description: "local path and remote path using withRemote",
      basepath: "data",
      withRemote: true,
      resource: {
        type: "table",
        path: "data/table.csv",
        schema: "https://example.com/schema.json",
      },
      descriptor: {
        type: "table",
        path: "table.csv",
        schema: "schema.json",
      },
    },
    {
      description: "remote paths with the same filename using withRemote",
      basepath: "data",
      withRemote: true,
      resource: {
        path: [
          "http://example1.com/table.csv",
          "http://example2.com/table.csv",
          "http://example3.com/table.csv",
          "http://example4.com/table.csv.zip",
          "http://example5.com/table.csv.zip",
        ],
      },
      descriptor: {
        path: [
          "table.csv",
          "table-1.csv",
          "table-2.csv",
          "table.csv.zip",
          "table-1.csv.zip",
        ],
      },
    },
    {
      description: "local paths in different folders",
      basepath: "data",
      resource: {
        type: "table",
        path: "data/folder1/table.csv",
        schema: "data/folder2/schema.json",
      },
      descriptor: {
        type: "table",
        path: "folder1/table.csv",
        schema: "folder2/schema.json",
      },
    },
    {
      description: "local paths in different folders using withoutFolders",
      basepath: "data",
      withoutFolders: true,
      resource: {
        type: "table",
        path: "data/folder1/table.csv",
        schema: "data/folder2/schema.json",
      },
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
          saveFile: async props => props.denormalizedPath,
        }),
      ).toEqual(descriptor)
    },
  )
})
