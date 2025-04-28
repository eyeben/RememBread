# Serve the React app with Nginx
FROM nginx:alpine

# 빌드된 파일 복사
COPY ./dist /usr/share/nginx/html

# Nginx 설정 덮어쓰기
COPY ./default.conf /etc/nginx/conf.d/default.conf

# 컨테이너가 3000 포트를 열도록 설정
EXPOSE 3000

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
