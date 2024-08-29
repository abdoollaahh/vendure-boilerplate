FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --production
RUN npm install -g concurrently

COPY . .

RUN npm run build

CMD ["sh", "-c", "npm run seed:once && npm run start"]