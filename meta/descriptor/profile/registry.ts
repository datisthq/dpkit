import dialect_1_0 from "./registry/dialect-1.0.json" with { type: "json" }
import dialect_2_0 from "./registry/dialect-2.0.json" with { type: "json" }
import package_1_0 from "./registry/package-1.0.json" with { type: "json" }
import package_2_0 from "./registry/package-2.0.json" with { type: "json" }
import resource_1_0 from "./registry/resource-1.0.json" with { type: "json" }
import resource_2_0 from "./registry/resource-2.0.json" with { type: "json" }
import schema_1_0 from "./registry/schema-1.0.json" with { type: "json" }
import schema_2_0 from "./registry/schema-2.0.json" with { type: "json" }

export type ProfileType = (typeof profileRegistry)[number]["type"]

export const profileRegistry = [
  {
    type: "dialect",
    path: "https://specs.frictionlessdata.io/schemas/csv-dialect.json",
    version: "1.0",
    profile: dialect_1_0,
  },
  {
    type: "dialect",
    path: "https://datapackage.org/profiles/1.0/tabledialect.json",
    version: "1.0",
    profile: dialect_1_0,
  },
  {
    type: "dialect",
    path: "https://datapackage.org/profiles/2.0/tabledialect.json",
    version: "2.0",
    profile: dialect_2_0,
  },
  {
    type: "package",
    path: "https://specs.frictionlessdata.io/schemas/data-package.json",
    version: "1.0",
    profile: package_1_0,
  },
  {
    type: "package",
    path: "https://datapackage.org/profiles/1.0/datapackage.json",
    version: "1.0",
    profile: package_1_0,
  },
  {
    type: "package",
    path: "https://datapackage.org/profiles/2.0/datapackage.json",
    version: "2.0",
    profile: package_2_0,
  },
  {
    type: "resource",
    path: "https://specs.frictionlessdata.io/schemas/data-resource.json",
    version: "1.0",
    profile: resource_1_0,
  },
  {
    type: "resource",
    path: "https://datapackage.org/profiles/1.0/dataresource.json",
    version: "1.0",
    profile: resource_1_0,
  },
  {
    type: "resource",
    path: "https://datapackage.org/profiles/2.0/dataresource.json",
    version: "2.0",
    profile: resource_2_0,
  },
  {
    type: "schema",
    path: "https://specs.frictionlessdata.io/schemas/table-schema.json",
    version: "1.0",
    profile: schema_1_0,
  },
  {
    type: "schema",
    path: "https://datapackage.org/profiles/1.0/tableschema.json",
    version: "1.0",
    profile: schema_1_0,
  },
  {
    type: "schema",
    path: "https://datapackage.org/profiles/2.0/tableschema.json",
    version: "2.0",
    profile: schema_2_0,
  },
]
