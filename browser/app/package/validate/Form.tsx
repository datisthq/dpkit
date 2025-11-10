import { Form } from "#components/Form/index.ts"
import { useValidatePackage } from "./queries.ts"

export function ValidatePackageForm() {
  const validatePackage = useValidatePackage()

  const handleSubmit = (source: string | File | Record<string, unknown>) => {
    if (source instanceof File) {
      throw new Error("Not implemented")
    }

    validatePackage.mutate({ source })
  }

  return <Form onSubmit={handleSubmit} />
}
