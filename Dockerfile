FROM marcelobaez/oracle-ic19:0.1.0 as base

WORKDIR /app

COPY package*.json ./

EXPOSE 4000

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . .
CMD ["node", "src/index.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD ["nodemon", "src/index.js"]