import { Form } from "#components/Form/index.ts"
import { useValidatePackage } from "./queries.ts"

export function ValidatePackageForm() {
  const validatePackage = useValidatePackage()

  const handleSubmit = (value: string | File) => {
    if (typeof value !== "string") throw new Error("Not implemented")
    validatePackage.mutate(value)
  }

  return <Form onSubmit={handleSubmit} />
}
