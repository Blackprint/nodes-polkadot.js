FROM node:16-buster-slim

# Prefer node package manager that more efficient
RUN npm i -g pnpm

# Create app folder for our project directory and clone the repositories
RUN mkdir /app

RUN apt-get update
RUN apt-get install -y git
RUN git clone --depth 1 https://github.com/Blackprint/nodes-polkadot.js.git /app/nodes-polkadot.js

WORKDIR "/app/nodes-polkadot.js"
RUN pnpm i
RUN npm run build-prod