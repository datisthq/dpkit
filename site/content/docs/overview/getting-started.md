---
title: dpkit Command-Line
sidebar:
  order: 1
  label: Getting Started
---

This guide will help you get started with dpkit. If you are new to the core framework's tecnhologies, please take a look at the [Data Package standard](https://datapackage.org/) and [Polars DataFrames](https://pola.rs/) documentation.

## Prerequisites

Supported operating systems:

- **Linux** (x64/arm64)
- **macOS** (x64/arm64)
- **Windows** (x64)

## Installation

dpkit is a command-line tool that can be downloaded as a binary executable or installed using Node.js and its package managers.

### Binary

You can download the latest binary from the [releases page](https://github.com/datisthq/dpkit/releases) or use the following command (for POSIX-compatible shells including Git for Windows):

```sh
curl -fsSL https://dpkit.dev/install.sh | sh
```

After downloading, you can verify the binary using the following command:

```sh
./dp --version
```

We recommend adding the binary to your PATH environment variable to make it easier to use.

### Node

You can install the CLI using this command:

```bash
npm install -g dpkit
```

After that you can use the CLI binary:

```bash
dp --version
```
