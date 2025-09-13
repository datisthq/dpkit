---
editUrl: false
next: false
prev: false
title: "savePackageToGithub"
---

> **savePackageToGithub**(`dataPackage`, `options`): `Promise`\<\{ `path`: `string`; `repoUrl`: `string`; \}\>

Defined in: github/build/package/save.d.ts:7

Save a package to a Github repository

## Parameters

### dataPackage

[`Package`](/reference/dpkit/package/)

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
