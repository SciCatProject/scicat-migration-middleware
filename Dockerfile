FROM node:16-alpine

# Prepare app directory
WORKDIR /home/node/app

# Set up local user
RUN chown -R node:node /home/node/app
USER node

COPY --chown=node:node . .

RUN npm ci

EXPOSE 3001

CMD ["npm", "start"]
