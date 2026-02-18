FROM maven:3-eclipse-temurin-25

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]