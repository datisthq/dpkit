import type * as errorTypes from "@dpkit/lib"
import {
  CellEnumError,
  CellExclusiveMaximumError,
  CellExclusiveMinimumError,
  CellMaxLengthError,
  CellMaximumError,
  CellMinLengthError,
  CellMinimumError,
  CellPatternError,
  CellRequiredError,
  CellTypeError,
  CellUniqueError,
} from "./Cell.tsx"
import { FieldNameError, FieldTypeError } from "./Field.tsx"
import { FieldsExtraError, FieldsMissingError } from "./Fields.tsx"
import { BytesError, HashError } from "./File.tsx"
import { MetadataError } from "./Metadata.tsx"
import { RowUniqueError } from "./Row.tsx"

export function Error(props: {
  error: errorTypes.MetadataError | errorTypes.FileError | errorTypes.TableError
}) {
  switch (props.error.type) {
    case "metadata":
      return <MetadataError error={props.error} />
    case "file/bytes":
      return <BytesError error={props.error} />
    case "file/hash":
      return <HashError error={props.error} />
    case "fields/missing":
      return <FieldsMissingError error={props.error} />
    case "fields/extra":
      return <FieldsExtraError error={props.error} />
    case "field/name":
      return <FieldNameError error={props.error} />
    case "field/type":
      return <FieldTypeError error={props.error} />
    case "row/unique":
      return <RowUniqueError error={props.error} />
    case "cell/type":
      return <CellTypeError error={props.error} />
    case "cell/required":
      return <CellRequiredError error={props.error} />
    case "cell/minimum":
      return <CellMinimumError error={props.error} />
    case "cell/maximum":
      return <CellMaximumError error={props.error} />
    case "cell/exclusiveMinimum":
      return <CellExclusiveMinimumError error={props.error} />
    case "cell/exclusiveMaximum":
      return <CellExclusiveMaximumError error={props.error} />
    case "cell/minLength":
      return <CellMinLengthError error={props.error} />
    case "cell/maxLength":
      return <CellMaxLengthError error={props.error} />
    case "cell/pattern":
      return <CellPatternError error={props.error} />
    case "cell/unique":
      return <CellUniqueError error={props.error} />
    case "cell/enum":
      return <CellEnumError error={props.error} />
  }
}
