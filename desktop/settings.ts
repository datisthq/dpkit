import nodePath from "node:path"

export const APP_NAME = "dpkit"
export const APP_USER_MODEL_ID = "app.dpkit"

// TODO: review
export const RENDERER_DIR = nodePath.join(
  import.meta.dirname,
  "..",
  "..",
  "node_modules",
  "@dpkit",
  "website",
  "build",
  "spa",
  "client",
)
