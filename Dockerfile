FROM zzrot/alpine-node

ENV NODE_ENV production
ENV PORT 50051

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
RUN npm install
COPY . /usr/src/app

EXPOSE 50051

CMD [ "npm", "start"]
