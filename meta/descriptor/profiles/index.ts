import dialect_1_0 from "./dialect-1.0.json" with { type: "json" }
import dialect_2_0 from "./dialect-2.0.json" with { type: "json" }
import package_1_0 from "./package-1.0.json" with { type: "json" }
import package_2_0 from "./package-2.0.json" with { type: "json" }
import resource_1_0 from "./resource-1.0.json" with { type: "json" }
import resource_2_0 from "./resource-2.0.json" with { type: "json" }
import schema_1_0 from "./schema-1.0.json" with { type: "json" }
import schema_2_0 from "./schema-2.0.json" with { type: "json" }

export const profiles = {
  "https://datapackage.org/profiles/1.0/tabledialect.json": dialect_1_0,
  "https://datapackage.org/profiles/1.0/datapackage.json": package_1_0,
  "https://datapackage.org/profiles/1.0/dataresource.json": resource_1_0,
  "https://datapackage.org/profiles/1.0/tableschema.json": schema_1_0,
  "https://datapackage.org/profiles/2.0/tabledialect.json": dialect_2_0,
  "https://datapackage.org/profiles/2.0/datapackage.json": package_2_0,
  "https://datapackage.org/profiles/2.0/dataresource.json": resource_2_0,
  "https://datapackage.org/profiles/2.0/tableschema.json": schema_2_0,
}
