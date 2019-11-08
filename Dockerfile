# Dockerfile

FROM node:12-alpine
EXPOSE 3000
WORKDIR /data
ADD . /data
RUN npm run build
CMD ["node", "server.js"]
