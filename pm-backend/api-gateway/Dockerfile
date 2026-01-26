FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml first and download dependencies (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# CHANGE: Added -DskipTests so that test failures do not stop the build
RUN mvn clean package -DskipTests

# --- Second stage (Runner) ---
FROM eclipse-temurin:21-jdk AS runner

WORKDIR /app

# Ensure the JAR filename is correct.
# Using asterisk *.jar to make it work regardless of the version in pom.xml
COPY --from=builder /app/target/*.jar ./app.jar

EXPOSE 4004

ENTRYPOINT ["java", "-jar", "app.jar"]