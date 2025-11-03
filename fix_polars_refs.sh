#!/bin/bash

# Navigate to table directory
cd /home/roll/projects/dpkit/table

# Find all .ts files (excluding node_modules and build)
find . -name "*.ts" -not -path "*/node_modules/*" -not -path "*/build/*" | while read file; do
  # Check if file has "import * as pl from"
  if grep -q "import \* as pl from \"nodejs-polars\"" "$file"; then
    # Replace common type references with pl. prefix
    sed -i 's/\([^.]\)DataType\([^a-zA-Z]\)/\1pl.DataType\2/g' "$file"
    sed -i 's/\([^.]\)Expr\([^a-zA-Z]\)/\1pl.Expr\2/g' "$file"
    sed -i 's/\([^.]\)DataFrame\([^a-zA-Z]\)/\1pl.DataFrame\2/g' "$file"
    sed -i 's/\([^.]\)LazyDataFrame\([^a-zA-Z]\)/\1pl.LazyDataFrame\2/g' "$file"
    sed -i 's/\([^.]\)SQLContext\([^a-zA-Z]\)/\1pl.SQLContext\2/g' "$file"

    # Replace function calls with pl. prefix (more careful to avoid false positives)
    sed -i 's/\([^.a-zA-Z]\)col(/\1pl.col(/g' "$file"
    sed -i 's/\([^.a-zA-Z]\)lit(/\1pl.lit(/g' "$file"
    sed -i 's/\([^.a-zA-Z]\)when(/\1pl.when(/g' "$file"
    sed -i 's/\([^.a-zA-Z]\)concatList(/\1pl.concatList(/g' "$file"
    sed -i 's/\([^.a-zA-Z]\)concatString(/\1pl.concatString(/g' "$file"

    # Handle cases at start of line
    sed -i 's/^col(/pl.col(/g' "$file"
    sed -i 's/^lit(/pl.lit(/g' "$file"
    sed -i 's/^when(/pl.when(/g' "$file"
    sed -i 's/^concatList(/pl.concatList(/g' "$file"
    sed -i 's/^concatString(/pl.concatString(/g' "$file"

    # Handle cases in type annotations
    sed -i 's/: DataType/: pl.DataType/g' "$file"
    sed -i 's/: Expr/: pl.Expr/g' "$file"
    sed -i 's/: DataFrame/: pl.DataFrame/g' "$file"
    sed -i 's/: LazyDataFrame/: pl.LazyDataFrame/g' "$file"
    sed -i 's/: SQLContext/: pl.SQLContext/g' "$file"

    echo "Fixed: $file"
  fi
done

# Also fix files that import from these modules
cd /home/roll/projects/dpkit

for dir in cli database inline; do
  if [ -d "$dir" ]; then
    find "$dir" -name "*.ts" -o -name "*.tsx" | while read file; do
      if grep -q "import \* as pl from \"nodejs-polars\"" "$file"; then
        sed -i 's/\([^.]\)DataFrame\([^a-zA-Z]\)/\1pl.DataFrame\2/g' "$file"
        sed -i 's/: DataFrame/: pl.DataFrame/g' "$file"
        echo "Fixed: $file"
      fi
    done
  fi
done
