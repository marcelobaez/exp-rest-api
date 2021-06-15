FROM marcelobaez/oracle-ic19

WORKDIR /exp-rest-api

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD ["node", "/exp-rest-api/src/index.js"]