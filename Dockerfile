FROM node:12.20-alpine
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install
COPY . /app
RUN chmod +x docker-run.sh
CMD ["sh", "docker-run.sh"]