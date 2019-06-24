FROM node

COPY package.json /screenshots/
WORKDIR /screenshots
RUN npm install
EXPOSE 4000
COPY . /screenshots/
CMD node app.js
