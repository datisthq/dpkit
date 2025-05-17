import type { Descriptor } from "../../descriptor/index.js"

type ProcessProps = {
  descriptor: Descriptor
}

export function processDialectOnLoad(props: ProcessProps) {
  makeCompatible(props)
}

function makeCompatible(_props: ProcessProps) {}
