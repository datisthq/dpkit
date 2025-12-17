import { Command } from "commander"
import { writeTempFile } from "frictionless-ts"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as sessionModule from "../../session.ts"
import { exploreResourceCommand } from "./explore.tsx"

vi.mock("../../components/Resource/Resource.tsx", () => ({
  Resource: vi.fn(() => null),
}))

describe("resource explore", () => {
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

  it("should call session methods when exploring a resource", async () => {
    const resourceDescriptor = JSON.stringify({
      name: "test-resource",
      path: "data.csv",
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
    })
    const descriptorPath = await writeTempFile(resourceDescriptor)

    const command = new Command()
      .addCommand(exploreResourceCommand)
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

  it("should handle resource with format", async () => {
    const resourceDescriptor = JSON.stringify({
      name: "test-resource",
      path: "data.json",
      format: "json",
    })
    const descriptorPath = await writeTempFile(resourceDescriptor)

    const command = new Command()
      .addCommand(exploreResourceCommand)
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
    const resourceDescriptor = JSON.stringify({
      name: "test-resource",
      path: "data.csv",
    })
    const descriptorPath = await writeTempFile(resourceDescriptor)

    const command = new Command()
      .addCommand(exploreResourceCommand)
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

  it("should handle resource with encoding", async () => {
    const resourceDescriptor = JSON.stringify({
      name: "test-resource",
      path: "data.csv",
      encoding: "utf-8",
      schema: {
        fields: [{ name: "id", type: "integer" }],
      },
    })
    const descriptorPath = await writeTempFile(resourceDescriptor)

    const command = new Command()
      .addCommand(exploreResourceCommand)
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
})
