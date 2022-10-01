FROM nikolaik/python-nodejs:latest
WORKDIR /code

COPY . .

RUN npm ci --legacy-peer-deps

ENV NODE_ENV development

EXPOSE 3000

CMD [ "npm", "start"]