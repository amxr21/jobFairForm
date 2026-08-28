# Two stages: build the Vite bundle, then serve the static output with nginx.
# The runtime image contains no Node and no node_modules — the SPA is just files.

FROM node:22.12.0-alpine AS build
WORKDIR /app

# VITE_API_URL is inlined into the bundle at BUILD time, so it must arrive as a
# build arg — a runtime env var on the container would come too late to have any
# effect. In Coolify this means marking it as a Build Variable, and changing it
# requires a redeploy, not a restart.
#
# src/config/api.js also throws when the value is missing, but that throw runs
# in the browser, so an unset variable still produces a successful build and a
# page that breaks on load. Fail here instead, where it is cheap to notice.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "ERROR: VITE_API_URL build arg is required. In Coolify, set it as a Build Variable." >&2; exit 1)

# package-lock.json is committed, so `npm ci` gives a reproducible install and
# skips the resolution work `npm install` would redo on every build — which
# matters on a 1 vCPU box where build time is the real constraint.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
