FROM node:6-alpine

RUN mkdir -p /usr/src/icolabora-form-mailer

WORKDIR /usr/src/icolabora-form-mailer

COPY package.json npm-shrinkwrap.json ./

RUN npm install --silent --progress-false && npm cache clean

COPY src/ views/ ./

CMD ["npm", "start"]