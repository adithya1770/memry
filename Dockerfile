FROM ubuntu

RUN apt update && apt install -y nodejs npm

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["node", "code.js"]