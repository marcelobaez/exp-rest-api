FROM marcelobaez/oracle-ic19:0.1.0

WORKDIR /usr/src/exp-rest-api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "/src/index.js"]