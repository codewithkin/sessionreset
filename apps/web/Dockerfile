# Build from the monorepo root: docker build -f apps/web/Dockerfile .
FROM node:22-slim AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.4.0 --activate

# Some platforms inject NODE_ENV=production at build time.
# pnpm reads that as --prod and skips devDependencies, which breaks next build.
ENV NODE_ENV=development

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/web/package.json apps/web/

RUN pnpm install --frozen-lockfile --filter web...

COPY apps/web/ apps/web/

ENV NODE_ENV=production

RUN pnpm --filter web build

# ---- Runner ----
FROM node:22-slim AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.4.0 --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

WORKDIR /app/apps/web

EXPOSE 3001

CMD ["pnpm", "start"]
