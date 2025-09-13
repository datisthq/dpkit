---
editUrl: false
next: false
prev: false
title: "ZenodoPackage"
---

Defined in: [zenodo/package/Package.ts:7](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/Package.ts#L7)

Zenodo Deposit interface

## Properties

### files

> **files**: [`ZenodoResource`](/reference/_dpkit/zenodo/zenodoresource/)[]

Defined in: [zenodo/package/Package.ts:100](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/Package.ts#L100)

Files associated with the deposit

***

### id

> **id**: `number`

Defined in: [zenodo/package/Package.ts:11](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/Package.ts#L11)

Deposit identifier

***

### links

> **links**: `object`

Defined in: [zenodo/package/Package.ts:16](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/Package.ts#L16)

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

Defined in: [zenodo/package/Package.ts:29](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/Package.ts#L29)

Deposit metadata

#### access\_right?

> `optional` **access\_right**: `string`

Access right, e.g., "open", "embargoed", "restricted", "closed"

#### communities?

> `optional` **communities**: `object`[]

Communities the deposit belongs to

#### creators

> **creators**: [`ZenodoCreator`](/reference/_dpkit/zenodo/zenodocreator/)[]

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

Defined in: [zenodo/package/Package.ts:105](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/Package.ts#L105)

State of the deposit

***

### submitted

> **submitted**: `boolean`

Defined in: [zenodo/package/Package.ts:110](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/Package.ts#L110)

Submitted flag
