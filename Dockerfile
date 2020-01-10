# Dockerfile

FROM node:13-alpine
EXPOSE 3000
WORKDIR /data
ADD . /data
RUN npm run build
CMD ["node", "server.js"]
