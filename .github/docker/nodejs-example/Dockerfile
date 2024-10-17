FROM node:20-buster-slim

# Prefer node package manager that more efficient
RUN npm i -g pnpm

COPY ./app/package.json /app/package.json

WORKDIR "/app"
RUN pnpm i