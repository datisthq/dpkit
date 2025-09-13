---
editUrl: false
next: false
prev: false
title: "ZenodoPackage"
---

Defined in: zenodo/build/package/Package.d.ts:6

Zenodo Deposit interface

## Properties

### files

> **files**: [`ZenodoResource`](/reference/dpkit/zenodoresource/)[]

Defined in: zenodo/build/package/Package.d.ts:85

Files associated with the deposit

***

### id

> **id**: `number`

Defined in: zenodo/build/package/Package.d.ts:10

Deposit identifier

***

### links

> **links**: `object`

Defined in: zenodo/build/package/Package.d.ts:14

Deposit URL

#### bucket

> **bucket**: `string`

#### discard?

> `optional` **discard**: `string`

#### edit?

> `optional` **edit**: `string`

#### files

> **files**: `string`

#### html

> **html**: `string`

#### publish?

> `optional` **publish**: `string`

#### self

> **self**: `string`

***

### metadata

> **metadata**: `object`

Defined in: zenodo/build/package/Package.d.ts:26

Deposit metadata

#### access\_right?

> `optional` **access\_right**: `string`

Access right, e.g., "open", "embargoed", "restricted", "closed"

#### communities?

> `optional` **communities**: `object`[]

Communities the deposit belongs to

#### creators

> **creators**: [`ZenodoCreator`](/reference/dpkit/zenodocreator/)[]

Creators of the deposit

#### description

> **description**: `string`

Description of the deposit

#### doi?

> `optional` **doi**: `string`

DOI of the deposit

#### keywords?

> `optional` **keywords**: `string`[]

Keywords/tags

#### license?

> `optional` **license**: `string`

License identifier

#### publication\_date?

> `optional` **publication\_date**: `string`

Publication date in ISO format (YYYY-MM-DD)

#### related\_identifiers?

> `optional` **related\_identifiers**: `object`[]

Related identifiers (e.g., DOIs of related works)

#### title

> **title**: `string`

Title of the deposit

#### upload\_type

> **upload\_type**: `string`

Upload type, e.g., "dataset"

#### version?

> `optional` **version**: `string`

Version of the deposit

***

### state

> **state**: `"unsubmitted"` \| `"inprogress"` \| `"done"`

Defined in: zenodo/build/package/Package.d.ts:89

State of the deposit

***

### submitted

> **submitted**: `boolean`

Defined in: zenodo/build/package/Package.d.ts:93

Submitted flag
