import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração global de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle("Scrum Management API")
    .setDescription("API para gerenciamento de ritos de Scrum")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap()
  .then(() => {
    console.log(
      `Application is running on: ${
        process.env.BACKEND_URL || "http://localhost:3001"
      }`
    );
  })
  .catch((error) => {
    console.error("Error starting the application:", error);
  });
