---
editUrl: false
next: false
prev: false
title: "CamtrapPackage"
---

Defined in: [camtrap/package/Package.ts:8](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L8)

Camera Trap Data Package interface built on top of the TDWG specification

## See

https://camtrap-dp.tdwg.org/metadata/

## Extends

- [`Package`](/reference/dpkit/package/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: core/build/package/Package.d.ts:21

Package schema URL for validation

#### Inherited from

[`Package`](/reference/dpkit/package/).[`$schema`](/reference/dpkit/package/#schema)

***

### bibliographicCitation?

> `optional` **bibliographicCitation**: `string`

Defined in: [camtrap/package/Package.ts:130](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L130)

Bibliographic citation for the dataset

***

### contributors

> **contributors**: `CamtrapContributor`[]

Defined in: [camtrap/package/Package.ts:26](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L26)

Contributors to the package

#### Required

#### Overrides

[`Package`](/reference/dpkit/package/).[`contributors`](/reference/dpkit/package/#contributors)

***

### coordinatePrecision?

> `optional` **coordinatePrecision**: `number`

Defined in: [camtrap/package/Package.ts:125](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L125)

Precision of geographic coordinates

***

### created

> **created**: `string`

Defined in: [camtrap/package/Package.ts:20](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L20)

Creation date of the package

#### Required

#### Format

ISO 8601

#### Overrides

[`Package`](/reference/dpkit/package/).[`created`](/reference/dpkit/package/#created)

***

### description?

> `optional` **description**: `string`

Defined in: core/build/package/Package.d.ts:29

A description of the package

#### Inherited from

[`Package`](/reference/dpkit/package/).[`description`](/reference/dpkit/package/#description)

***

### homepage?

> `optional` **homepage**: `string`

Defined in: core/build/package/Package.d.ts:33

A URL for the home page of the package

#### Inherited from

[`Package`](/reference/dpkit/package/).[`homepage`](/reference/dpkit/package/#homepage)

***

### image?

> `optional` **image**: `string`

Defined in: core/build/package/Package.d.ts:63

Package image

#### Inherited from

[`Package`](/reference/dpkit/package/).[`image`](/reference/dpkit/package/#image)

***

### keywords?

> `optional` **keywords**: `string`[]

Defined in: core/build/package/Package.d.ts:54

Keywords for the package

#### Inherited from

[`Package`](/reference/dpkit/package/).[`keywords`](/reference/dpkit/package/#keywords)

***

### licenses?

> `optional` **licenses**: `CamtrapLicense`[]

Defined in: [camtrap/package/Package.ts:141](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L141)

Licenses for the package
Extended with scope property

#### Overrides

[`Package`](/reference/dpkit/package/).[`licenses`](/reference/dpkit/package/#licenses)

***

### name?

> `optional` **name**: `string`

Defined in: core/build/package/Package.d.ts:17

Unique package identifier
Should use lowercase alphanumeric characters, periods, hyphens, and underscores

#### Inherited from

[`Package`](/reference/dpkit/package/).[`name`](/reference/dpkit/package/#name)

***

### profile

> **profile**: `string`

Defined in: [camtrap/package/Package.ts:13](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L13)

Package profile identifier

#### Required

***

### project

> **project**: `object`

Defined in: [camtrap/package/Package.ts:32](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L32)

Project metadata

#### acronym?

> `optional` **acronym**: `string`

Project acronym

#### captureMethod

> **captureMethod**: (`"activityDetection"` \| `"timeLapse"`)[]

Capture method used

##### Required

#### description?

> `optional` **description**: `string`

Project description

#### id?

> `optional` **id**: `string`

Project identifier

#### individualAnimals

> **individualAnimals**: `boolean`

Whether individual animals were identified

##### Required

#### observationLevel

> **observationLevel**: (`"media"` \| `"event"`)[]

Level at which observations are recorded

##### Required

#### path?

> `optional` **path**: `string`

Project URL or path

#### samplingDesign

> **samplingDesign**: `"simpleRandom"` \| `"systematicRandom"` \| `"clusteredRandom"` \| `"experimental"` \| `"targeted"` \| `"opportunistic"`

Sampling design methodology

##### Required

#### title

> **title**: `string`

Project title

##### Required

#### Required

***

### relatedIdentifiers?

> `optional` **relatedIdentifiers**: `RelatedIdentifier`[]

Defined in: [camtrap/package/Package.ts:135](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L135)

Related identifiers for the dataset

***

### resources

> **resources**: [`Resource`](/reference/dpkit/resource/)[]

Defined in: core/build/package/Package.d.ts:12

Data resources in this package (required)

#### Inherited from

[`Package`](/reference/dpkit/package/).[`resources`](/reference/dpkit/package/#resources)

***

### sources?

> `optional` **sources**: [`Source`](/reference/dpkit/source/)[]

Defined in: core/build/package/Package.d.ts:50

Data sources for this package

#### Inherited from

[`Package`](/reference/dpkit/package/).[`sources`](/reference/dpkit/package/#sources)

***

### spatial

> **spatial**: `GeoJSON`

Defined in: [camtrap/package/Package.ts:94](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L94)

Spatial coverage of the data

#### Required

***

### taxonomic

> **taxonomic**: `TaxonomicCoverage`[]

Defined in: [camtrap/package/Package.ts:120](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L120)

Taxonomic coverage of the data

#### Required

***

### temporal

> **temporal**: `object`

Defined in: [camtrap/package/Package.ts:100](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/camtrap/package/Package.ts#L100)

Temporal coverage of the data

#### end

> **end**: `string`

End date of temporal coverage

##### Required

##### Format

ISO 8601

#### start

> **start**: `string`

Start date of temporal coverage

##### Required

##### Format

ISO 8601

#### Required

***

### title?

> `optional` **title**: `string`

Defined in: core/build/package/Package.d.ts:25

Human-readable title

#### Inherited from

[`Package`](/reference/dpkit/package/).[`title`](/reference/dpkit/package/#title)

***

### version?

> `optional` **version**: `string`

Defined in: core/build/package/Package.d.ts:38

Version of the package using SemVer

#### Example

```ts
"1.0.0"
```

#### Inherited from

[`Package`](/reference/dpkit/package/).[`version`](/reference/dpkit/package/#version)
