import type { UnboundError } from "frictionless-ts"
import {
  CellEnumError,
  CellExclusiveMaximumError,
  CellExclusiveMinimumError,
  CellJsonSchemaError,
  CellMaxLengthError,
  CellMaximumError,
  CellMinLengthError,
  CellMinimumError,
  CellPatternError,
  CellRequiredError,
  CellTypeError,
  CellUniqueError,
} from "./Cell.tsx"
import { DataError } from "./Data.tsx"
import { FieldNameError, FieldTypeError } from "./Field.tsx"
import { FieldsExtraError, FieldsMissingError } from "./Fields.tsx"
import { BytesError, EncodingError, HashError } from "./File.tsx"
import { ForeignKeyError } from "./ForeignKey.tsx"
import { MetadataError } from "./Metadata.tsx"
import { RowUniqueError } from "./Row.tsx"

export function Error(props: {
  error: UnboundError
}) {
  const { error } = props

  switch (error.type) {
    case "metadata":
      return <MetadataError error={error} />
    case "data":
      return <DataError error={error} />
    case "file/bytes":
      return <BytesError error={error} />
    case "file/hash":
      return <HashError error={error} />
    case "file/encoding":
      return <EncodingError error={error} />
    case "fields/missing":
      return <FieldsMissingError error={error} />
    case "fields/extra":
      return <FieldsExtraError error={error} />
    case "field/name":
      return <FieldNameError error={error} />
    case "field/type":
      return <FieldTypeError error={error} />
    case "row/unique":
      return <RowUniqueError error={error} />
    case "cell/type":
      return <CellTypeError error={error} />
    case "cell/required":
      return <CellRequiredError error={error} />
    case "cell/minimum":
      return <CellMinimumError error={error} />
    case "cell/maximum":
      return <CellMaximumError error={error} />
    case "cell/exclusiveMinimum":
      return <CellExclusiveMinimumError error={error} />
    case "cell/exclusiveMaximum":
      return <CellExclusiveMaximumError error={error} />
    case "cell/minLength":
      return <CellMinLengthError error={error} />
    case "cell/maxLength":
      return <CellMaxLengthError error={error} />
    case "cell/pattern":
      return <CellPatternError error={error} />
    case "cell/unique":
      return <CellUniqueError error={error} />
    case "cell/enum":
      return <CellEnumError error={error} />
    case "cell/jsonSchema":
      return <CellJsonSchemaError error={error} />
    case "foreignKey":
      return <ForeignKeyError error={error} />
    default:
      return null
  }
}
