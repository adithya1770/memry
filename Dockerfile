FROM ubuntu

RUN apt update && \
    apt install -y nodejs npm && \
    apt clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["node", "code.js"]