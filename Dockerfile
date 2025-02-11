FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

COPY package*.json ./

# 使用 pnpm 安装依赖
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 13000

CMD ["sh", "-c", "ls -la dist/src && node -v && npm -v && npm run start:prod"]
