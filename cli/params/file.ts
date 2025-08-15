import { Option } from "commander"

export const hashType = new Option("--hash-type <type>", "hash type")
  .choices(["md5", "sha1", "sha256", "sha512"])
  .default("sha256")
