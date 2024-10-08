# Usa uma imagem base oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências, somente as de produção
RUN npm install --only=production

# Copia o restante da aplicação para dentro do container
COPY . .

# Expõe a porta que o Fastify vai utilizar (porta 3333 neste caso)
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
