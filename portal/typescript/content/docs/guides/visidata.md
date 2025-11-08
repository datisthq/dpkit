---
title: Using dpkit with VisiData
sidebar:
  label: VisiData
  order: 11
---

[VisiData](https://www.visidata.org/) provide a powerful and flexible environment for data exploration, visualization, and analysis. dpkit can be used as a tool that prepared data for following usage in VisiData.

## Installation

- [Install dpkit CLI](https://dpkit.dev/overview/getting-started/)
- [Install VisiData](https://www.visidata.org/install/)

## Usage

For example, we can use dpkit to copy a remote Data Package to a local folder and then load it in VisiData.

```bash
dpkit copy https://zenodo.org/records/7559361 --toFolder dataset --withRemote
vd dataset/*.csv
```

> [!TIP]
> Functionality allowing to copy a Data Package to a SQLite database is under development. Once it is ready, it will be possible to prepare data to VisiData in more type-safe manner.

## References

- [Visidata](https://www.visidata.org/)
