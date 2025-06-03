FROM node:22.14.0

WORKDIR /frontend

COPY package*.json .

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]