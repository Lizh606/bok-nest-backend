# 使用官方 Node.js 22.12.0 作为基础镜像
FROM node:22.12.0

# 设置工作目录
WORKDIR /usr/src/app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml (提前复制这些文件可以利用缓存)
COPY package*.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install

# 复制源代码和环境文件
COPY . .
COPY .env.production

# 构建应用
RUN pnpm build

# 暴露端口
EXPOSE 13000

# 启动应用
CMD ["pnpm", "start:prod"]