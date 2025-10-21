# The build context is the root of the project
FROM node:24-alpine
WORKDIR /dpkit

COPY pnpm-lock.yaml .
RUN corepack enable pnpm
RUN pnpm fetch

COPY . .
RUN pnpm install:ci
RUN pnpm build

EXPOSE 8080
CMD ["node", "app/rpc.ts"]
