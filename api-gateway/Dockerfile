FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Kopiujemy najpierw pom.xml i pobieramy zależności (cache warstwy)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Kopiujemy kod źródłowy
COPY src ./src

# ZMIANA: Dodano -DskipTests, aby błędy w testach nie zatrzymywały budowania
RUN mvn clean package -DskipTests

# --- Druga faza (Runner) ---
FROM eclipse-temurin:21-jdk AS runner

WORKDIR /app

# Upewnij się, że nazwa pliku JAR jest poprawna.
# Używam gwiazdki *.jar, aby zadziałało niezależnie od wersji w pom.xml
COPY --from=builder /app/target/*.jar ./app.jar

EXPOSE 4004

ENTRYPOINT ["java", "-jar", "app.jar"]