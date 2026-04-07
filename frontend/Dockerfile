# ─── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy deps
COPY package.json package-lock.json ./
RUN npm install

# Copy code
COPY . .

# Build
RUN npm run build

# ─── Production stage ─────────────────────────────────────────
FROM nginx:alpine AS runtime

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build assets to default nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if we want standalone, but we'll use a main proxy.
# For now, this container can serve itself on 80.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
