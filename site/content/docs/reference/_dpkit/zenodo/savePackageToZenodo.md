---
editUrl: false
next: false
prev: false
title: "savePackageToZenodo"
---

> **savePackageToZenodo**(`dataPackage`, `options`): `Promise`\<\{ `datasetUrl`: `string`; `path`: `string`; \}\>

Defined in: [zenodo/package/save.ts:18](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/save.ts#L18)

Save a package to Zenodo

## Parameters

### dataPackage

[`Package`](/reference/_dpkit/core/package/)

### options

Object containing the package to save and Zenodo API details

#### apiKey

`string`

#### sandbox?

`boolean`

## Returns

`Promise`\<\{ `datasetUrl`: `string`; `path`: `string`; \}\>

Object with the deposit URL and DOI
