---
title: Getting Started
sidebar:
  order: 1
---

This guide will help you get started with dpkit. If you are new to the core framework's tecnhologies, please take a look at the [Data Package standard](https://datapackage.org/) and [Polars DataFrames](https://pola-rs.github.io/polars) documentation.


## Installation

:::note[Prerequisites]
- **Node.js v20+**
:::

The framework can be installed as one package:

```bash
npm install dpkit
```

Or cherry-picked from individual packages:

```bash
npm install @dpkit/core @dpkit/zenodo
```

## TypeScript

:::tip
Use **Node.js v24+** to be able to run TypeScript files directly with the `node` binary like `node my-data-script.ts`
:::

dpkit is built with type safety in mind. It uses TypeScript to provide type definitions for all packages and to enforce type safety throughout the framework. It's highly reccomended to setup a TypeScript aware environment to work with the project.

## Usage

Here is an example of loading a Camtrap DP package from Zenodo preserving full type-safety of the extension and merging system Zenodo metadata into a user data package:

```ts
import { loadPackage, type CamtrapPackage } from "dpkit"

const { datapackage } = await loadPackage<CamtrapPackage>({
  source: "https://zenodo.org/records/10053903",
})

console.log(datapackage)
```
