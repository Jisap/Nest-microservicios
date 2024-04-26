import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');           // Ruta ppal de la API.
  
  app.useGlobalPipes(                   // Validaciones globales
    new ValidationPipe({
      whitelist: true,                  // Solo muestra la data que estoy esperando en el dto
      forbidNonWhitelisted: true,       // Si viene un parametro que no esta en el whitelist, se lanza un error
    })
);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`)
}
bootstrap();
