FROM openjdk:17-jdk-slim

WORKDIR /app

COPY build/libs/*.jar app.jar

# OSM 파일 복사
COPY src/main/resources/map-data map-data

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
