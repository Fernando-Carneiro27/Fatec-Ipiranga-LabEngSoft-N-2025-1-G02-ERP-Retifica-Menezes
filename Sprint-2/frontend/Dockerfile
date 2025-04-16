FROM node:22.14.0

# Definir diretório de trabalho dentro do container
WORKDIR /frontend

COPY package*.json .

COPY . .

# Instalar dependências
RUN npm install

# Build da aplicação
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]