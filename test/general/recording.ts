import { Polly } from "@pollyjs/core"
import { beforeAll, beforeEach, afterAll } from "vitest"

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
            `${suite.file.filepath.substring(0, suite.file.filepath.lastIndexOf("/"))}/recordings`,
        },
      },
    })
  })

  beforeEach(context => {
    // Overwrite recording name on a per-test basis
    polly.recordingName = options.recordingName ?? context.task.name
  })

  afterAll(async () => {
    await polly.stop()
  })

  return
}
