---
editUrl: false
next: false
prev: false
title: "savePackageToZenodo"
---

> **savePackageToZenodo**(`dataPackage`, `options`): `Promise`\<\{ `datasetUrl`: `string`; `path`: `string`; \}\>

Defined in: dataset/build/plugins/zenodo/package/save.d.ts:7

Save a package to Zenodo

## Parameters

### dataPackage

[`Package`](/reference/package/)

### options

Object containing the package to save and Zenodo API details

#### apiKey

`string`

#### sandbox?

`boolean`

## Returns

`Promise`\<\{ `datasetUrl`: `string`; `path`: `string`; \}\>

Object with the deposit URL and DOI
