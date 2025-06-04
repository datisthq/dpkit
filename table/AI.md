# Data Package and Polars integration

## Tasks

### 1. Implement schema/convert/fromPolars.ts function

We need a function that converts a `PolarsSchema` object to a data package Table `Schema` object.

### 2. Implement schema/convert/toPolars.ts function

We need a function that converts a data package Table `Schema` object to a `PolarsSchema` object.

### 3. Implment `parseNumberColumn` function and its specs

- Use `parseIntegerColumn` as a reference
- Use https://github.com/frictionlessdata/frictionless-py/blob/main/frictionless/fields/number.py
- Use https://github.com/frictionlessdata/frictionless-py/blob/main/frictionless/fields/__spec__/test_number.py

### 4. Implment `parseBooleanColumn` function and its specs

- Use `parseIntegerColumn` as a reference
- Use https://github.com/frictionlessdata/frictionless-py/blob/main/frictionless/fields/boolean.py
- Use https://github.com/frictionlessdata/frictionless-py/blob/main/frictionless/fields/__spec__/test_boolean.py

## References

- https://github.com/pola-rs/nodejs-polars/blob/main/polars/datatypes/field.ts
- https://github.com/pola-rs/nodejs-polars/blob/main/polars/datatypes/datatype.ts

