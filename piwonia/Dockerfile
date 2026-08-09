# Etap 1 — budowa aplikacji Next.js
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etap 2 — runtime: sam serwer standalone, bez zaleznosci deweloperskich
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# .next/standalone zawiera server.js i przesledzone moduly; static i public
# Next kopiuje osobno — bez nich strona wstanie bez CSS/JS i bez zdjec.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

# Optymalizator next/image zapisuje przeskalowane zdjecia do .next/cache. Katalog
# musi nalezec do uzytkownika `node`, inaczej kazde zadanie o obrazek konczy sie
# odrzuconym Promise (EACCES: mkdir '/app/.next/cache').
RUN mkdir -p .next/cache && chown -R node:node .next

USER node
EXPOSE 3000
CMD ["node", "server.js"]
