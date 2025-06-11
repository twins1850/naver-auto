FROM node:18-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 포트 설정
EXPOSE 5173

# 개발 서버 시작 (프로덕션에서는 nginx 사용 권장)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 