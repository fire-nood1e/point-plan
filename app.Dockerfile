FROM node:22

WORKDIR /app

RUN npm install -g pnpm

COPY app/package.json ./
COPY app/pnpm-lock.yaml ./

RUN pnpm install

COPY app .

CMD ["pnpm", "start", "--host", "0.0.0.0"]
