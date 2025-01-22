FROM node:20.15.1-alpine AS builder

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json ./

RUN npm install --force

COPY . ./

RUN npm run build

# production environment
FROM node:20.15.1-alpine

COPY --from=builder /app/build /app

WORKDIR /app

RUN npm install -g serve

ENTRYPOINT ["serve", "-s", "-l", "tcp://0.0.0.0:3000"]