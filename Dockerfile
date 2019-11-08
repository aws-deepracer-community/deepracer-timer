# Dockerfile

FROM node:12-alpine
EXPOSE 3000
WORKDIR /data
# RUN npm run build
ADD . /data
CMD ["node", "server.js"]
