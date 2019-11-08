# Dockerfile

FROM node:12 as BUILD
WORKDIR /build
COPY . /build/
RUN npm run build

FROM node:12-alpine
WORKDIR /data
COPY --from=BUILD /build/ /data/
# ADD . /data
# RUN npm run build
EXPOSE 3000
CMD ["node", "server.js"]
