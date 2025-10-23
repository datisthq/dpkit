---
title: Self-Hosting dpkit Cloud
sidebar:
  label: dpkit Cloud
  order: 11
---

This document provides a brief overview of self-hosting [dpkit Cloud](https://cloud.dpkit.dev) on your own infrastructure.

> [!WARNING]
> Currently, this setup below is blocked by [this CloudFlare issue](https://github.com/cloudflare/containers/issues/101).

> [!TIP]
> dpkit Cloud is built on top of [Cloudflare Workers](https://workers.cloudflare.com/) but it is possible to use any other runtime that fits your needs e.g. Digital Ocean Apps or Docker.

## Deployment

1. Fork the [dpkit repository](https://github.com/datisthq/dpkit) to your GitHub account.
2. Clone the forked repository to your local machine.
3. Update the `wrangler.jsonc` with you application name e.g. `dpkit-cloud-custom`.
4. Setup a new CloudFlare worker with the following configuration:
  - Name: e.g. `dpkit-cloud-custom` (should be the same as in `wrangler.jsonc`)
  - Github repository: point to your forked repository
  - Build command: `pnpm build && pnpm -F cloud build`
  - Deploy command: `cd cloud && pnpm wrangler deploy`
  - Branch deploy command: `cd cloud && pnpm wrangler versions upload`
  - Variables ans secrets: `NODE_VERSION=24`
5. Push a new commit to your forked repository to trigger the build and deployment.

## Usage

Find a `workder.dev` subdomain in your CloudFlare dashboard and visit it in your browser or add a custom domain if it is desired. Now, you can use your custom dpkit Cloud the same way you use [dpkit Cloud](https://cloud.dpkit.dev).

## Support

We happy to help with a deployment of any complexity. Please [reach out to us to get a quote](https://www.linkedin.com/in/evgeny-karev/).
