#!/bin/bash

cd /home/roll/projects/dpkit/table

# Find all .ts files (excluding node_modules and build)
find . -name "*.ts" -not -path "*/node_modules/*" -not -path "*/build/*" | while read file; do
  # Check if file has "import * as pl from"
  if grep -q "import \* as pl from \"nodejs-polars\"" "$file"; then
    # Fix type annotations (after colons)
    sed -i 's/: DataFrame\>/: pl.DataFrame/g' "$file"
    sed -i 's/: LazyDataFrame\>/: pl.LazyDataFrame/g' "$file"
    sed -i 's/: DataType\>/: pl.DataType/g' "$file"
    sed -i 's/: Expr\>/: pl.Expr/g' "$file"
    sed -i 's/: SQLContext\>/: pl.SQLContext/g' "$file"

    # Fix generic parameters
    sed -i 's/<DataFrame\>/<pl.DataFrame/g' "$file"
    sed -i 's/<LazyDataFrame\>/<pl.LazyDataFrame/g' "$file"
    sed -i 's/<DataType\>/<pl.DataType/g' "$file"
    sed -i 's/<Expr\>/<pl.Expr/g' "$file"

    # Fix function calls (word boundary before function name)
    sed -i 's/\bcol(/pl.col(/g' "$file"
    sed -i 's/\blit(/pl.lit(/g' "$file"
    sed -i 's/\bwhen(/pl.when(/g' "$file"
    sed -i 's/\bconcatList(/pl.concatList(/g' "$file"
    sed -i 's/\bconcatString(/pl.concatString(/g' "$file"

    echo "Fixed: $file"
  fi
done

# Fix other directories
cd /home/roll/projects/dpkit

for dir in cli database inline; do
  if [ -d "$dir" ]; then
    find "$dir" -name "*.ts" -o -name "*.tsx" | while read file; do
      if grep -q "import \* as pl from \"nodejs-polars\"" "$file"; then
        sed -i 's/: DataFrame\>/: pl.DataFrame/g' "$file"
        sed -i 's/<DataFrame\>/<pl.DataFrame/g' "$file"
        echo "Fixed: $file"
      fi
    done
  fi
done

echo "Done!"
