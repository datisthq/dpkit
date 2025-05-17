import type { Descriptor } from "../../descriptor/index.js"

type ProcessProps = {
  descriptor: Descriptor
}

export async function processDialectOnLoad(props: ProcessProps) {
  normalizeProperties(props)
}

async function normalizeProperties(_props: ProcessProps) {}
