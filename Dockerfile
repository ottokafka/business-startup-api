
FROM node:8

WORKDIR /opt/startup

# install deps
COPY package.json /opt/startup
RUN npm install

# Setup workdir
COPY . /opt/startup

# run
EXPOSE 5000
CMD ["npm", "start"]