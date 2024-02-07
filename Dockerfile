FROM node:20-alpine as video_server_builder
WORKDIR /service_app/video_server
COPY package*.json ./
RUN npm i && npm install typescript -g
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /service_app/video_server
COPY package*.json ./
RUN npm i
COPY --from=video_server_builder /service_app/video_server/dist/ ./dist

EXPOSE 4000

CMD [ "node", "dist/index.js" ]