import type { Descriptor } from "@dpkit/lib"
import { Form } from "#components/Form/index.ts"
import { useValidatePackage } from "./queries.ts"

export function ValidatePackageForm() {
  const validatePackage = useValidatePackage()

  const handleSubmit = (value: string | File | Descriptor) => {
    if (value instanceof File) {
      throw new Error("File upload not implemented")
    }

    validatePackage.mutate(value)
  }

  return <Form onSubmit={handleSubmit} />
}
