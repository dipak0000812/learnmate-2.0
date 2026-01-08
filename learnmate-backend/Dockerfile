FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Expose API Port
EXPOSE 5000

# production environment
ENV NODE_ENV=production

CMD ["node", "cluster.js"]
