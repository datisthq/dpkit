import FetchAdapter from "@pollyjs/adapter-fetch"
import { Polly } from "@pollyjs/core"
import FSPersister from "@pollyjs/persister-fs"
import { afterAll, beforeAll, beforeEach } from "vitest"

// @ts-ignore
Polly.register(FSPersister)

// @ts-ignore
Polly.register(FetchAdapter)

/**
 * Sets up Polly for recording and replaying HTTP interactions in tests.
 *
 * https://github.com/Netflix/pollyjs/issues/499
 *
 * @param {Object} [options={}] - Configuration options for the recording.
 * @param {string} [options.recordingName] - The name of the recording. If not provided, the suite name will be used.
 * @param {string} [options.recordingPath] - The path to save the recordings. If not provided, the recordings will be saved in a "__recordings__" directory next to the test file.
 */
export function useRecording(
  options: { recordingName?: string; recordingPath?: string } = {},
) {
  let polly: Polly

  beforeAll(suite => {
    polly = new Polly(options.recordingName ?? suite.name, {
      adapters: ["fetch"],
      mode: "replay",
      recordIfMissing: true,
      recordFailedRequests: true,
      persister: "fs",
      persisterOptions: {
        fs: {
          recordingsDir:
            options.recordingPath ??
            `${suite.file.filepath.substring(0, suite.file.filepath.lastIndexOf("/"))}/fixtures/generated`,
        },
      },
    })
  })

  beforeEach(context => {
    // Overwrite recording name on a per-test basis
    polly.recordingName = options.recordingName ?? getFullTaskName(context.task)
  })

  afterAll(async () => {
    await polly.stop()
  })
}

function getFullTaskName(item: any): string {
  const suiteName = item.suite ? getFullTaskName(item.suite) : undefined
  return [suiteName, item.name].filter(Boolean).join("-")
}
