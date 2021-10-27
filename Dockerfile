FROM node:17.0.1-alpine3.12

# Install cli dependencies
RUN apk add git
RUN npm i -g heroku

# Install node dependencies
COPY package*.json ./
RUN npm i

# Copy over contents
COPY . .

# Execute nodejs files
CMD [ "npm", "start" ]

