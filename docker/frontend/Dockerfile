FROM nikolaik/python-nodejs:latest
WORKDIR /code

COPY . .

RUN npm install

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npm", "start"]