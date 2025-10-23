---
title: Self-Hosting dpkit Service
sidebar:
  label: dpkit Service
  order: 10
---

This document provides a brief overview of self-hosting **dpkit Service** on your own infrastructure, a OpenAPI-compatible web-server powering [dpkit Cloud](https://cloud.dpkit.dev).

## Instructions

1. Install `@dpkit/service` package.
2. Within your project, create a `main.ts` file:

```ts
import { createServer } from "@dpkit/service/node"

createServer({ start: true })
```
```
Listening on http://localhost:8080/api
```

## Usage

Visit `http://localhost:8080` to see the OpenAPI documentation for using your service. You can use your new API as any other OpenAPI-compatible service.

## Support

We happy to help with a deployment of any complexity. Please [reach out to us to get a quote](https://www.linkedin.com/in/evgeny-karev/).
