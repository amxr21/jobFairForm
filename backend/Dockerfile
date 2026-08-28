# Single stage: the Prisma client is generated into node_modules, and the app
# runs straight from source (no build step), so splitting build/runtime would
# only mean copying node_modules across and saving nothing.

FROM node:22.12.0-alpine
WORKDIR /app

# bcrypt ships prebuilt binaries for musl, but node-gyp is the fallback path if
# a prebuild is ever missing for this platform. Without these, `npm ci` fails
# with a compile error that reads like an unrelated install bug.
RUN apk add --no-cache python3 make g++

# Copy the Prisma schema and config BEFORE `npm ci`: package.json's postinstall
# runs `prisma generate`, which reads prisma/schema.prisma via prisma.config.cjs.
# If they are not present yet, install fails with a missing-schema error.
#
# prisma.config.cjs deliberately falls back to a placeholder connection string,
# so generate works here without DATABASE_URL — the real value is a runtime env
# var, and no database is contacted during the build.
COPY package.json package-lock.json prisma.config.cjs ./
COPY prisma ./prisma
RUN npm ci --omit=dev

COPY . .

# server.js reads process.env.PORT and falls back to 2001. Coolify injects PORT,
# so this default only matters when running the image directly.
ENV PORT=2001
EXPOSE 2001

# Run as the node user rather than root. The app writes nothing to disk —
# uploads stream to Cloudinary — so it needs no writable paths of its own.
USER node

CMD ["node", "server.js"]
