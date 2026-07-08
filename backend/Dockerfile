FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run migrate

EXPOSE 5000

CMD ["node", "server.js"]
