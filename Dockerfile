FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm install -g nodemon
EXPOSE 3000
CMD ["nodemon", "index.js"]
