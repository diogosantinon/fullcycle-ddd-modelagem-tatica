FROM node:lts-alpine

WORKDIR /usr/src/app

# RUN npm install typesript --save-dev

RUN chown -R node:node /usr/src/app \
    && npm install -g npm@10.8.3 \
    && npm install typescript --save-dev \
    && npm install tslint --save-dev \
    && npm install @types/jest \
    && npm install ts-node --save-dev\
    && npm install uuid --save-dev \
    && npm install @types/uuid --save-dev \
    && npm install jest --save-dev\
    && npm install @swc/jest @swc/cli @swc/core --save-dev\
    && npm install jest-cli --save-dev 

#USER node

EXPOSE 3000