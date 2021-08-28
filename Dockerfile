FROM node:16.8.0-alpine3.14
COPY src /usr/app/src
COPY *.json /usr/app
COPY *.js /usr/app
WORKDIR /usr/app
RUN npm install 
RUN npm run build


ENTRYPOINT ["node", "."]