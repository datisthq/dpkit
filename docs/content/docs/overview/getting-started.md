---
title: Getting Started
sidebar:
  order: 1
---

This guide will help you get started with dpkit. If you are new to the core framework's tecnhologies, please take a look at the [Data Package standard](https://datapackage.org/) and [Polars DataFrames](https://pola.rs/) documentation.

## Runtimes

:::tip
- It is possible to use dpkit in [Jupyter Notebooks](/guides/jupyter)!
:::

dpkit and all its packages support all the prominent TypeScript runtimes:

- **Node.js v20+**
- **Deno v2+**
- **Bun v1+**

The core package `@dpkit/core` additionally supports browser environments:

- **Edge v92+**
- **Chrome v92+**
- **Firefox v90+**
- and others

## Installation

:::note
The documentation uses `npm` command to install packages. If you are using other package managers, please adjust the commands accordingly.
:::

The framework can be installed as one package:

```bash
npm install dpkit
```

Or cherry-picked from individual packages:

```bash
npm install @dpkit/core @dpkit/zenodo
```

Or the core package can be just imported in browsers using NPM CDNs:

```js
import { loadPackageDescriptor } from "https://esm.sh/@dpkit/core"
```

## TypeScript

:::tip
Use **Node.js v24+** to be able to run TypeScript files directly with the `node` binary like `node my-data-script.ts`
:::

dpkit is built with type safety in mind. It uses TypeScript to provide type definitions for all packages and to enforce type safety throughout the framework. It's highly reccomended to setup a TypeScript aware environment to work with the project.

## Examples

Loading a Camtrap DP package from Zenodo merging system Zenodo metadata into a user data package and validating its metadata:

```ts
import { loadPackage } from "dpkit"

const { dataPackage } = await loadPackage("https://zenodo.org/records/10053903")

console.log(dataPackage)
//{
//  id: 'https://doi.org/10.5281/zenodo.10053903',
//  profile: 'tabular-data-package',
//  ...
//}

```

Example of using a Data Package extension in type-safe manner. Not supported properties will indicate type errors in your IDE:

```ts
import { loadPackage, assertCamtrapPackage } from "dpkit"

const { dataPackage } = await loadPackage("https://raw.githubusercontent.com/tdwg/camtrap-dp/refs/tags/1.0.1/example/datapackage.json")

const camtrapPackage = await assertCamtrapPackage(dataPackage)

console.log(camtrapPackage.project.title)
// Management of Invasive Coypu and muskrAt in Europe
console.log(camtrapPackage.bibliographicCitation)
// Desmet P, Neukermans A, Van der beeck D, Cartuyvels E (2022)...
```

Validating an in-memory package descriptor:

```ts
import { validatePackageDescriptor } from "dpkit"

const { valid, errors } = await validatePackageDescriptor({ name: "package" })

console.log(valid)
// false
console.log(errors)
//[
//  {
//    instancePath: '',
//    schemaPath: '#/required',
//    keyword: 'required',
//    params: { missingProperty: 'resources' },
//    message: "must have required property 'resources'",
//    type: 'descriptor'
//  }
//]
```

Loading a package from a remote descriptor and saving it locally as a zip archive, and then using it as a local data package:

```ts
import {
  loadPackageDescriptor,
  loadPackageFromZip,
  savePackageToZip,
  getTempFilePath,
} from "dpkit"

const archivePath = getTempFilePath()
const sourcePath = await loadPackageDescriptor(
  "https://raw.githubusercontent.com/roll/currency-codes/refs/heads/master/datapackage.json",
)

await savePackageToZip(sourcePackage, { archivePath })
const targetPackage = await loadPackageFromZip(archivePath)
console.log(targetPackage)
```

Reading a CSV table:

```ts
import { loadTable } from "dpkit"

const table = await loadTable({ path: "data.csv" })

// Load with custom dialect
const table = await loadTable({
  path: "data.csv",
  dialect: {
    delimiter: ";",
    header: true,
    skipInitialSpace: true
  }
})
```

## Reference

See **API Reference** of each individual package for more details. Note, that `dpkit` package re-exports most of the functionality.
