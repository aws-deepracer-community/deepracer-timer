# Dockerfile

FROM node:13 as BUILD
WORKDIR /build
COPY . /build
RUN npm run build

FROM node:13-alpine
EXPOSE 3000
WORKDIR /data
COPY --from=BUILD /build /data
# ADD . /data
# RUN npm run build
CMD ["node", "server.js"]
