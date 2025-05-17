import type { Descriptor } from "../../descriptor/index.js"

type ProcessProps = {
  descriptor: Descriptor
}

export function processSchemaOnLoad(props: ProcessProps) {
  normalizeProperties(props)
}

function normalizeProperties(_props: ProcessProps) {}
