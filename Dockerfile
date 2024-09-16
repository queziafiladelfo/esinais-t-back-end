# Usar a imagem oficial do Node.js 20.16.0
FROM node:20.16.0

# Instalar FFMPEG
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Instalar o Yarn
RUN npm install --global yarn

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o arquivo package.json e yarn.lock e instalar as dependências com Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Instalar novamente o canvas para evitar problemas
RUN yarn rebuild canvas

# Copiar o restante do código da aplicação para o contêiner
COPY . .

# Expor a porta 8080, conforme configurado no código
EXPOSE 8080

# Comando para rodar a aplicação usando Yarn
CMD ["yarn", "run", "dev"]