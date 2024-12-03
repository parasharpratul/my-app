FROM node:10
WORKDIR /app
COPY . .
RUN npm install
ENV SECRET_WORD="MY_SECRET_WORD"
CMD ["node", "index.js"]
