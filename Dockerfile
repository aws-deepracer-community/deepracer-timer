# Dockerfile

FROM node:16-alpine

LABEL maintainer="me@nalbam.com" \
      org.opencontainers.image.description="A Docker image for DeepRacer Timer" \
      org.opencontainers.image.authors="Jungyoul Yu, me@nalbam.com, https://www.nalbam.com/" \
      org.opencontainers.image.source="https://github.com/nalbam/deepracer-timer" \
      org.opencontainers.image.title="deepracer-timer"

EXPOSE 3000

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["node", "server.js"]
