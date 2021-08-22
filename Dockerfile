FROM node:14.17.5-slim
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 4100
CMD ["npm", "run", "start" ]