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

# .next/standalone zawiera server.js i przesledzone moduly; static Next kopiuje
# osobno — bez niego strona wstanie bez CSS i JS.
# (Ten projekt nie ma katalogu public/, wiec nie ma czego stad kopiowac.)
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

# Serwer Next zapisuje do .next/cache; katalog musi nalezec do uzytkownika `node`,
# inaczej leca odrzucone Promise'y (EACCES: mkdir '/app/.next/cache').
RUN mkdir -p .next/cache && chown -R node:node .next

USER node
EXPOSE 3000
CMD ["node", "server.js"]
