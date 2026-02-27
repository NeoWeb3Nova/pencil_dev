#!/bin/bash
# 在 Docker 容器内运行 Prisma 迁移

set -e

echo "🔄 Running Prisma migrations inside Docker container..."

# 复制项目文件到临时容器
docker run --rm --network container:web3-job-app-db \
  -v "$(pwd)":/app \
  -w /app \
  node:22-alpine sh -c "
    npm install --silent && \
    npx prisma generate && \
    npx prisma migrate deploy && \
    echo '✅ Migrations completed!'
  "

echo "✅ Done!"
