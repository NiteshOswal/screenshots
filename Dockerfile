FROM node

COPY package.json /screenshort/
WORKDIR /screenshort
RUN npm install
EXPOSE 4000
COPY . /screenshort/
CMD node app.js