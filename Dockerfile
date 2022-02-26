FROM node:14.18.1-alpine3.13
WORKDIR /app

RUN npm install -g @angular/cli
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm","start"]