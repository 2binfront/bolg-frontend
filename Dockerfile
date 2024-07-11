# 使用 Node.js 官方镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app-frontend

# 复制 package.json 和 package-lock.json
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com

# 安装项目依赖
RUN npm install
RUN npm install pinia
RUN npm install ipx
# 复制项目文件
COPY . .

ARG API_URL
ENV API_URL ${API_URL}

# 编译 TypeScript 代码
RUN npm run build

# 暴露应用程序端口
EXPOSE 3000

# 启动应用程序
CMD ["node", ".output/server/index.mjs"]
