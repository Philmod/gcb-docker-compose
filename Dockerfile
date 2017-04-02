FROM zzrot/alpine-node

# Need libc6-compat for grpc on alpine.
RUN apk update && \
    apk add libc6-compat

ENV NODE_ENV production
ENV PORT 50051

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json /usr/src/app/package.json
RUN npm install
ADD . /usr/src/app

EXPOSE 50051

CMD [ "npm", "start"]
