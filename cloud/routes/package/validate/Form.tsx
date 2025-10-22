import type { Descriptor } from "@dpkit/core"
import { Form } from "#components/Form/index.ts"
import { useValidatePackage } from "./queries.ts"

export function ValidatePackageForm() {
  const validatePackage = useValidatePackage()

  const handleSubmit = (source: string | File | Descriptor) => {
    if (source instanceof File) {
      throw new Error("Not implemented")
    }

    validatePackage.mutate({ source })
  }

  return <Form onSubmit={handleSubmit} />
}
