import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');           // Ruta ppal de la API.
  
  app.useGlobalPipes(                   // Validaciones globales
    new ValidationPipe({
      whitelist: true,                  // Solo muestra la data que estoy esperando en el dto
      forbidNonWhitelisted: true,       // Si viene un parametro que no esta en el whitelist, se lanza un error
    })
);

  await app.listen(3000);
}
bootstrap();
