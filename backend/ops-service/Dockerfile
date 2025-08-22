FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven wrapper and pom files
COPY ../pom.xml ./parent-pom.xml
COPY ../shared/ ./shared/
COPY pom.xml ./
COPY src/ ./src/

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build shared module first
RUN cd shared && mvn clean install -DskipTests

# Build the application
RUN mvn clean package -DskipTests

# Run the application
EXPOSE 8080
CMD ["java", "-jar", "target/ops-service-1.0.0.jar"]
