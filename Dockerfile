# Dockerfile

FROM node:12 as BUILD
COPY . /data/
RUN npm run build

FROM node:12-alpine
EXPOSE 3000
WORKDIR /data
COPY --from=BUILD /data/ /data/
# ADD . /data
# RUN npm run build
CMD ["node", "server.js"]
