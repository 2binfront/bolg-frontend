# 使用 Node.js 官方镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app-frontend

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 编译 TypeScript 代码
RUN pnpm run build

# 暴露应用程序端口
EXPOSE 3000

# 启动应用程序
CMD ["node", ".output/server/index.mjs"]
