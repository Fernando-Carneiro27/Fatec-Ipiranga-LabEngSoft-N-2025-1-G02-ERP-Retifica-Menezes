# Usar uma imagem oficial do Node.js
FROM node:22.14.0

# Definir diretório de trabalho dentro do container
WORKDIR /frontend

# Copiar arquivos de configuração do frontend para o container
COPY pakcage*.json .

# Copiar arquivos do frontend para o container
COPY . .

# Instalar dependências
RUN npm install

# Build da aplicação
RUN npm run build

# Porta do frontend
EXPOSE 3000

# Comando para rodar o frontend
CMD ["npm", "start"]