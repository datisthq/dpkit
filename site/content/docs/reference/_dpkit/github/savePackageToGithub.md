---
editUrl: false
next: false
prev: false
title: "savePackageToGithub"
---

> **savePackageToGithub**(`dataPackage`, `options`): `Promise`\<\{ `path`: `string`; `repoUrl`: `string`; \}\>

Defined in: [github/package/save.ts:15](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/github/package/save.ts#L15)

Save a package to a Github repository

## Parameters

### dataPackage

[`Package`](/reference/_dpkit/core/package/)

### options

Object containing the package to save and Github details

#### apiKey

`string`

#### org?

`string`

#### repo

`string`

## Returns

`Promise`\<\{ `path`: `string`; `repoUrl`: `string`; \}\>

Object with the repository URL
