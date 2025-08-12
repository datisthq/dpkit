import type * as fields from "./types/index.ts"

/**
 * A Table Schema field
 */
export type Field =
  | fields.StringField
  | fields.NumberField
  | fields.IntegerField
  | fields.BooleanField
  | fields.ObjectField
  | fields.ArrayField
  | fields.ListField
  | fields.DateField
  | fields.TimeField
  | fields.DatetimeField
  | fields.YearField
  | fields.YearmonthField
  | fields.DurationField
  | fields.GeopointField
  | fields.GeojsonField
  | fields.AnyField
