# Dockerfile (place next to server.js)
FROM node:18-alpine

WORKDIR /usr/src/app

# copy package manifests first for better caching
COPY package*.json ./

# install dependencies (use npm ci if package-lock.json exists)
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --only=production; fi

# copy application source
COPY . .

# set environment
ENV NODE_ENV=production

# expose port used by your app (default 5000)
EXPOSE 5000

# start server
CMD ["node", "server.js"]
