# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# TreePulse landing page — multi-stage production image
# Final image: Next.js standalone server, non-root, listening on 0.0.0.0:3000
# ---------------------------------------------------------------------------

FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- dependencies (deterministic install from the lockfile) ----------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ----------------------------------------------------------------
FROM base AS builder
# NEXT_PUBLIC_* values are inlined at build time, so the APK URL must be a
# build argument. Empty is valid and yields the "Coming soon" state.
ARG NEXT_PUBLIC_ANDROID_APK_URL=""
ARG NEXT_PUBLIC_SITE_URL=""
ENV NEXT_PUBLIC_ANDROID_APK_URL=${NEXT_PUBLIC_ANDROID_APK_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runtime ------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# standalone output only: server bundle + its minimal node_modules,
# plus static assets and the public folder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# self-contained health check (no wget/curl dependency)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
