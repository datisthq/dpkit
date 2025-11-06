import { writeTempFile } from "@dpkit/dataset"
import { Command } from "commander"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as sessionModule from "../../session.ts"
import { exploreSchemaCommand } from "./explore.tsx"

vi.mock("../../components/SchemaGrid.tsx", () => ({
  SchemaGrid: vi.fn(() => null),
}))

describe("schema explore", () => {
  let mockRender: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockRender = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(sessionModule.Session, "create").mockImplementation(() => {
      const session = {
        task: vi.fn(async (_message: string, promise: Promise<any>) => {
          try {
            return await promise
          } catch (error) {
            console.log(String(error))
            return undefined
          }
        }),
        render: mockRender,
        terminate: vi.fn((msg: string) => {
          throw new Error(msg)
        }),
      }
      return session as any
    })
  })

  it("should call session methods when exploring a schema", async () => {
    const schemaDescriptor = JSON.stringify({
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    })
    const descriptorPath = await writeTempFile(schemaDescriptor)

    const command = new Command()
      .addCommand(exploreSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "explore", descriptorPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
    expect(mockRender).toHaveBeenCalled()
  })

  it("should handle schema with constraints", async () => {
    const schemaDescriptor = JSON.stringify({
      fields: [
        { name: "id", type: "integer", constraints: { required: true } },
        { name: "email", type: "string", format: "email" },
      ],
    })
    const descriptorPath = await writeTempFile(schemaDescriptor)

    const command = new Command()
      .addCommand(exploreSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "explore", descriptorPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
    expect(mockRender).toHaveBeenCalled()
  })

  it("should handle json output option", async () => {
    const schemaDescriptor = JSON.stringify({
      fields: [
        { name: "id", type: "integer" },
        { name: "value", type: "number" },
      ],
    })
    const descriptorPath = await writeTempFile(schemaDescriptor)

    const command = new Command()
      .addCommand(exploreSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "explore",
        descriptorPath,
        "--json",
      ])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
    expect(mockRender).toHaveBeenCalled()
  })

  it("should terminate when schema is empty", async () => {
    const schemaDescriptor = JSON.stringify({})
    const descriptorPath = await writeTempFile(schemaDescriptor)

    const command = new Command()
      .addCommand(exploreSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "explore", descriptorPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.terminate).toHaveBeenCalledWith(
      "Schema is not available",
    )
  })
})
